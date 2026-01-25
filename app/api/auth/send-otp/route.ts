import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

// Gmail SMTP transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

// OTP Schema for database storage
const OTPSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    userData: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-delete after 10 minutes
});

// Get or create OTP model
const OTP = mongoose.models.OTP || mongoose.model('OTP', OTPSchema);

// Generate 6-digit OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { email, name, password, country, state } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const emailLower = email.toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({ email: emailLower });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP in database (upsert)
        await OTP.findOneAndUpdate(
            { email: emailLower },
            {
                email: emailLower,
                otp,
                userData: { email: emailLower, name, password, country, state },
                createdAt: new Date()
            },
            { upsert: true, new: true }
        );

        // Send OTP via Gmail
        try {
            await transporter.sendMail({
                from: `"AMICUS" <${process.env.GMAIL_USER}>`,
                to: emailLower,
                subject: 'AMICUS - Email Verification Code',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #1e3a5f; text-align: center;">AMICUS Email Verification</h2>
                        <p style="color: #333; font-size: 16px;">Hello${name ? ` ${name}` : ''},</p>
                        <p style="color: #333; font-size: 16px;">Your verification code is:</p>
                        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e3a5f;">${otp}</span>
                        </div>
                        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
                        <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">AMICUS - Your AI Legal Assistant</p>
                    </div>
                `,
            });
            console.log(`✅ OTP email sent to ${email} via Gmail`);
        } catch (emailError) {
            console.error('Gmail sending error:', emailError);
            console.log(`[DEV] OTP for ${email}: ${otp}`);
        }

        return NextResponse.json({
            message: 'OTP sent successfully',
            // In development, return OTP for testing (remove in production)
            otp: otp
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { error: 'Failed to send OTP' },
            { status: 500 }
        );
    }
}
