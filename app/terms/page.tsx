'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { acceptTerms } from '../actions';
import { CheckSquare, Square } from 'lucide-react';

export default function Terms() {
    const [userId, setUserId] = useState<string | null>(null);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        const id = localStorage.getItem('amicus_user_id');
        setUserId(id);
    }, []);

    const handleAccept = async () => {
        if (userId && accepted) {
            await acceptTerms(userId);
        }
    };

    return (
        <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-8 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-navy-900 via-gold-500 to-navy-900" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl w-full border-l-2 border-gold-500/30 pl-8 py-4"
            >
                <h1 className="text-4xl font-serif text-slate-100 mb-8">Protocol of Engagement</h1>

                <div className="space-y-6 text-slate-400 font-light leading-relaxed text-lg mb-12">
                    <p>
                        <strong className="text-slate-200">1. Non-Human Counsel.</strong> Amicus AI is an artificial intelligence system powered by Gemini 3. It is not a licensed attorney, and no attorney-client privilege is established.
                    </p>
                    <p>
                        <strong className="text-slate-200">2. Zero Retention.</strong> Archives are ephemeral. Documents uploaded to the Vault are analyzed in-stream and immediately expunged from memory. We cannot recover lost data.
                    </p>
                    <p>
                        <strong className="text-slate-200">3. Verification Required.</strong> While Amicus strives for statutory precision based on your defined jurisdiction, all strategic output should be verified by human counsel before executing binding legal actions.
                    </p>
                </div>

                <div
                    onClick={() => setAccepted(!accepted)}
                    className="flex items-center gap-4 cursor-pointer group mb-8 select-none"
                >
                    <div className={`text-gold-500 transition-all ${accepted ? 'scale-110' : 'opacity-50'}`}>
                        {accepted ? <CheckSquare size={24} /> : <Square size={24} />}
                    </div>
                    <span className="text-slate-300 group-hover:text-slate-100 transition-colors">
                        I understand and accept the terms of this AI consultancy.
                    </span>
                </div>

                <button
                    onClick={handleAccept}
                    disabled={!userId || !accepted}
                    className={`px-8 py-3 font-bold tracking-widest uppercase text-sm transition-all duration-300
            ${userId && accepted
                            ? 'bg-gold-500 text-navy-950 hover:bg-gold-400 cursor-pointer'
                            : 'bg-navy-800 text-navy-600 cursor-not-allowed border border-navy-700'
                        }`}
                >
                    Enter Console
                </button>

            </motion.div>
        </div>
    );
}
