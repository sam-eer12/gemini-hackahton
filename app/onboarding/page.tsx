'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { registerUser } from '../actions';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const result = await registerUser(formData);
        if (result.error) {
            setError(result.error);
        } else {
            // Store rough session in localStorage for this demo (Not secure for production!)
            localStorage.setItem('amicus_user_id', result.userId!);
            router.push('/terms');
        }
    }

    return (
        <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-gold-500/5 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-navy-900/80 border border-slate-800 p-10 backdrop-blur-md relative z-10"
            >
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-serif text-slate-100 mb-2">Amicus Intake</h1>
                    <p className="text-slate-400 text-sm">Define your jurisdiction for precise legal alignment.</p>
                </div>

                <form action={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gold-500">Identity</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full bg-navy-950 border border-slate-700 p-4 text-slate-200 focus:border-gold-500 focus:outline-none transition-colors placeholder:text-slate-600"
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Access Key (Password)"
                            required
                            className="w-full bg-navy-950 border border-slate-700 p-4 text-slate-200 focus:border-gold-500 focus:outline-none transition-colors placeholder:text-slate-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gold-500">Jurisdiction</label>
                        <select name="country" required className="w-full bg-navy-950 border border-slate-700 p-4 text-slate-200 focus:border-gold-500 focus:outline-none appearance-none">
                            <option value="" disabled selected>Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="Canada">Canada</option>
                        </select>

                        <input
                            name="state"
                            type="text"
                            placeholder="State / Province (e.g., Delhi, California)"
                            required
                            className="w-full bg-navy-950 border border-slate-700 p-4 text-slate-200 focus:border-gold-500 focus:outline-none transition-colors placeholder:text-slate-600"
                        />
                    </div>

                    {error && <p className="text-red-400 text-xs">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-4 bg-slate-200 text-navy-950 font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors mt-4"
                    >
                        Proceed to Protocol
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
