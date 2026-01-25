import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import https from 'https';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { user_json_url, userData } = await req.json();

        if (!user_json_url || !userData) {
            return NextResponse.json(
                { error: 'Missing verification data' },
                { status: 400 }
            );
        }

        const { email, password, name } = userData;

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Missing user information' },
                { status: 400 }
            );
        }

        // Fetch verified email from phone.email JSON URL
        const verifiedEmail = await new Promise<string>((resolve, reject) => {
            https.get(user_json_url, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        const user_email_id = jsonData.user_email_id;

                        if (!user_email_id) {
                            reject(new Error('No email found in verification response'));
                            return;
                        }

                        resolve(user_email_id);
                    } catch (e) {
                        reject(new Error('Failed to parse verification response'));
                    }
                });
            }).on('error', (err) => {
                reject(new Error('Failed to fetch verification data: ' + err.message));
            });
        });

        // Verify that the verified email matches the signup email
        if (verifiedEmail.toLowerCase() !== email.toLowerCase()) {
            return NextResponse.json(
                { error: 'Email verification mismatch. Please use the same email address.' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: verifiedEmail });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create verified user
        const newUser = await User.create({
            email: verifiedEmail,
            password: hashedPassword,
            name,
            email_verified: true,
            verified_at: new Date(),
        });

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
        console.error('Email verification error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
