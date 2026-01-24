import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);

export async function POST(req: NextRequest) {
    try {
        const { userId, prompt } = await req.json();

        if (!userId || !prompt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();
        const user = await User.findById(userId);

        const jurisdiction = user ? `${user.jurisdiction_country}, ${user.jurisdiction_state}` : 'Unknown';

        const systemInstruction = `
      You are Amicus Contract Forge, an expert legal drafter.
      CONTEXT: User Jurisdiction is ${jurisdiction}. Ensure the contract adheres to local laws (e.g., if India, use Indian Contract Act 1872; if US, use UCC/Common Law).
      TASK: Draft a professional, legally robust contract based on the user's requirements.
      FORMAT: Markdown. Use clear headings, bold terms for definitions, and standard legal structure (parties, recitals, terms, termination, governing law).
      TONE: Formal, Precise, Binding.
      OUTPUT: JUST the contract markdown. No preamble.
    `;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ contract: text });

    } catch (error) {
        console.error("Forge Error:", error);
        return NextResponse.json({ error: 'Forge failed' }, { status: 500 });
    }
}
