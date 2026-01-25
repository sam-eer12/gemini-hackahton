import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const userId = formData.get('userId') as string;
        const mode = formData.get('mode') as string; // 'contract_scan' or default

        if (!file || !userId) {
            return NextResponse.json({ error: 'Missing file or user' }, { status: 400 });
        }

        await connectToDatabase();
        const user = await User.findById(userId);
        const jurisdiction = user ? `${user.jurisdiction_country}, ${user.jurisdiction_state}` : 'Unknown';

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');

        // Determine mime type
        const mimeType = file.type;

        let systemInstruction = `
        You are Amicus, a legal document analyst.
        CONTEXT: User Jurisdiction is ${jurisdiction}.
        TASK: Analyze the provided document. Summarize key points, identify potential risks, and cite specific relevant laws if applicable.
        OUTPUT: Markdown format. Clear, structured, and professional.
    `;

        if (mode === 'contract_scan') {
            systemInstruction = `
            You are Amicus Red Flag Scanner.
            CONTEXT: User Jurisdiction is ${jurisdiction}.
            TASK: Audit the attached contract for "Red Flags" (High risk clauses, unfair indemnity, jurisdiction traps, ambiguity).
            OUTPUT: Markdown. List the "Red Flags" with a severity rating (High/Medium/Low) and explain WHY it is dangerous in plain English. Finally, suggest a fairer alternative phrasing.
            TONE: Critical, Protective of the Client.
        `;
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            systemInstruction: systemInstruction
        });

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            },
            mode === 'contract_scan' ? "Audit this contract." : "Analyze this legal document."
        ]);

        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ result: text });

    } catch (error) {
        console.error("Analysis Error:", error);
        return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
    }
}
