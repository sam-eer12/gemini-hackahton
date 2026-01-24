'use server'

import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs'; // 1. Add this import

export async function registerUser(formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password') as string; // Ensure string type
    const country = formData.get('country');
    const state = formData.get('state');

    if (!email || !password || !country || !state) {
        return { error: 'Missing required fields' };
    }

    await connectToDatabase();

    try {
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            // OPTIONAL: If updating an existing user, you might want to re-hash 
            // the new password if they provided a different one. 
            // For now, we update jurisdiction only.
            existingUser.jurisdiction_country = country;
            existingUser.jurisdiction_state = state;
            existingUser.onboarding_complete = false; 
            await existingUser.save();
            
            return { success: true, userId: existingUser._id.toString() };
        }

        // 2. Hash the password before creating the user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword, // 3. Save the HASH, not the plain text
            jurisdiction_country: country,
            jurisdiction_state: state,
            onboarding_complete: false,
        });

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