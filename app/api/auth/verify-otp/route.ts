import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// OTP Schema (same as in send-otp)
const OTPSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    userData: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 }
});

// Get or create OTP model
const OTP = mongoose.models.OTP || mongoose.model('OTP', OTPSchema);

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        const emailLower = email.toLowerCase();

        // Get stored OTP data from database
        const storedData = await OTP.findOne({ email: emailLower });

        if (!storedData) {
            return NextResponse.json(
                { error: 'OTP expired or not found. Please request a new code.' },
                { status: 400 }
            );
        }

        // Verify OTP
        if (storedData.otp !== otp) {
            return NextResponse.json(
                { error: 'Invalid OTP. Please try again.' },
                { status: 400 }
            );
        }

        // OTP verified - create user
        const { userData } = storedData;

        // Check if user already exists (double check)
        const existingUser = await User.findOne({ email: emailLower });
        if (existingUser) {
            await OTP.deleteOne({ email: emailLower });
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Create verified user
        const newUser = await User.create({
            email: emailLower,
            password: hashedPassword,
            name: userData.name,
            jurisdiction_country: userData.country || null,
            jurisdiction_state: userData.state || null,
            email_verified: true,
            verified_at: new Date(),
        });

        // Clear OTP from database
        await OTP.deleteOne({ email: emailLower });

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return NextResponse.json(
            {
                message: 'Email verified and account created successfully',
                token,
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    name: newUser.name,
                }
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { error: error.message || 'Verification failed' },
            { status: 500 }
        );
    }
}
