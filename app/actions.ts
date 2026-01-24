'use server'

import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { redirect } from 'next/navigation';

export async function registerUser(formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');
    const country = formData.get('country');
    const state = formData.get('state');

    if (!email || !password || !country || !state) {
        return { error: 'Missing required fields' };
    }

    await connectToDatabase();
    console.log('Registering user:', email, country, state);

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User exists, updating...');
            // For demo purposes, we update the existing user's jurisdiction
            existingUser.jurisdiction_country = country;
            existingUser.jurisdiction_state = state;
            existingUser.onboarding_complete = false; // Reset to force T&C
            await existingUser.save();
            console.log('User updated:', existingUser._id);
            return { success: true, userId: existingUser._id.toString() };
        }

        const newUser = await User.create({
            email,
            password, // In a real app, hash this!
            jurisdiction_country: country,
            jurisdiction_state: state,
            onboarding_complete: false,
        });
        console.log('User created:', newUser._id);

        return { success: true, userId: newUser._id.toString() };

    } catch (error) {
        console.error("Registration Error:", error);
        return { error: `Failed to create account: ${error}` };
    }
}

export async function acceptTerms(userId: string) {
    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { onboarding_complete: true });
    redirect('/chat');
}
