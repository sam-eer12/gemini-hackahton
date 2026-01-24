'use client';

import { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown'; // FIXED: Named import
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const id = localStorage.getItem('amicus_user_id');
        if (!id) {
            router.push('/onboarding');
            return;
        }
        setUserId(id);
        setMessages([
            { role: 'model', content: "I am Amicus. My jurisdiction protocols are active. How may I advise you today?" }
        ]);
    }, [router]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function handleSend() {
        if (!input.trim() || !userId || loading) return;

        const userMsg = input;
        setInput('');
        
        // Optimistically add user message
        const newMessages = [...messages, { role: 'user', content: userMsg } as Message];
        setMessages(newMessages);
        setLoading(true);

        try {
            // Filter history for API: Remove greeting, keep only previous exchange
            // Note: We do NOT include the 'userMsg' we just typed in the history array passed to startChat.
            // startChat initializes the *past*. sendMessage handles the *current* turn.
            const apiHistory = messages
                .filter(m => m.content !== "I am Amicus. My jurisdiction protocols are active. How may I advise you today?")
                .map(m => ({
                    role: m.role === 'model' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                }));

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    message: userMsg,
                    history: apiHistory
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Consultation failed');
            }

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'model', content: data.reply }]);

        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'model', content: "Connection to Amicus Core disrupted. Please try again." }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen bg-navy-950 text-slate-200 overflow-hidden font-sans">
            <Sidebar />

            <main className="flex-1 flex flex-col relative w-full">
                <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-navy-950/95 backdrop-blur z-10">
                    <span className="text-sm text-slate-400 uppercase tracking-widest">Privileged & Confidential</span>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-navy-800">
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-2xl p-6 rounded-sm text-sm leading-relaxed border
                  ${msg.role === 'user'
                                        ? 'bg-navy-800 border-slate-700 text-slate-200'
                                        : 'bg-transparent border-none text-slate-300 pl-0'
                                    }`}
                            >
                                {msg.role === 'model' && <div className="text-xs text-gold-500 uppercase tracking-widest mb-2 font-bold">Amicus</div>}
                                <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-navy-900 prose-pre:border prose-pre:border-slate-800">
                                    <Markdown
                                        components={{
                                            strong: ({ node, ...props }) => <strong className="text-slate-100 font-bold" {...props} />
                                        }}
                                    >
                                        {msg.content}
                                    </Markdown>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="max-w-2xl px-0 py-6">
                                <div className="text-xs text-gold-500 uppercase tracking-widest mb-2 font-bold animate-pulse">Analyzing Precedents...</div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-slate-800 bg-navy-950">
                    <div className="max-w-4xl mx-auto relative flex items-center gap-4">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="State your legal inquiry..."
                            className="flex-1 bg-navy-900 border border-slate-700 p-4 text-slate-200 focus:border-gold-500 focus:outline-none transition-all placeholder:text-slate-600 rounded-sm"
                            disabled={loading}
                            autoFocus
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="p-4 bg-gold-600/10 border border-gold-600/30 text-gold-500 hover:bg-gold-600 hover:text-navy-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}