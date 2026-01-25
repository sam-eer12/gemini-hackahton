import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        
        return NextResponse.json({
            exists: !!existingUser,
            message: existingUser ? 'User already exists' : 'Email is available'
        });
    } catch (error) {
        console.error('Check email error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
