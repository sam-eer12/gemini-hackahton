import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);

export async function POST(req: NextRequest) {
    try {
        const { userId, message, history } = await req.json();

        if (!userId || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { jurisdiction_country, jurisdiction_state } = user;

        // Construct the System Prompt
        const systemInstruction = `
      You are Amicus, an elite legal strategist.
      CONTEXT: User is in ${jurisdiction_country || 'Unknown Country'}, ${jurisdiction_state || 'Unknown State'}. Apply local laws specifically for this jurisdiction.
      TONE: Direct, Unbiased, Simple. No fluff. Do not say "As an AI".
      RESTRICTION: Do not offer moral judgment, only legal strategy.
      Explain complex legal concepts in simple "5th-grade" terms but maintain an authoritative professional tone.
      If the user's query is not legal in nature, politely steer them back to legal matters or answer briefly if simple.
    `;

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            systemInstruction: systemInstruction
        });

        const chat = model.startChat({
            history: history || [], // Simple history passing
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        // In a real app we would stream this, but for simplicity/stability in this demo we await full response
        return NextResponse.json({ reply: text });

    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
