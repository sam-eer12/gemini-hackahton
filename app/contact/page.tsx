'use client';

import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import Prism from "@/app/animations/Prism";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setResult('');
        setSuccess(false);

        const formData = new FormData(event.currentTarget);
        formData.append('access_key', 'dbb12da2-22b7-4553-839a-efb2b312f97e');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setResult('Message sent successfully. We will get back to you shortly.');
                setSuccess(true);
                (event.target as HTMLFormElement).reset();
            } else {
                setResult(data.message || 'Something went wrong. Please try again.');
                setSuccess(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setResult('Network error. Please check your connection and try again.');
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full bg-navy-950 text-slate-200 relative overflow-x-hidden" style={{ minWidth: '100vw' }}>
            <div className="fixed inset-0 w-full h-full pointer-events-none opacity-75 z-0" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
                <Prism
                    animationType="rotate"
                    timeScale={0.5}
                    height={3.5}
                    baseWidth={5.5}
                    scale={3.6}
                    hueShift={0}
                    colorFrequency={1}
                    noise={0}
                    glow={1}
                />
            </div>
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]" />

            {/* Navigation */}
            <Navbar showAuthButton={false} />

            {/* Contact Section */}
            <section className="max-w-7xl mx-auto px-8 py-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-serif text-slate-100 mb-4">Contact Us</h1>
                    <div className="h-px w-32 bg-gold-500" />
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div>
                            <h3 className="text-2xl font-serif text-slate-100 mb-4">Get in Touch</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Have questions about our AI-powered legal services? Need assistance with our platform?
                                We're here to help. Send us a message and our team will respond promptly.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-400">
                                <div className="p-3 bg-navy-800 rounded-sm">
                                    <Mail size={20} className="text-gold-500" />
                                </div>
                                <span>sameer870732@gmail.com</span>
                            </div>
                        </div>

                        <div className="bg-navy-900/50 border border-slate-800/50 p-6">
                            <p className="text-sm text-slate-500 italic">
                                "Swift, precise, jurisdiction-aware counsel available 24/7.
                                The future of legal consultation is here."
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-gold-500 flex items-center gap-2">
                                    <User size={14} />
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Your Name"
                                    className="w-full bg-navy-900 border border-slate-700 p-4 text-slate-200 focus:border-gold-500 focus:outline-none transition-colors placeholder:text-slate-600"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-gold-500 flex items-center gap-2">
                                    <Mail size={14} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="your@email.com"
                                    className="w-full bg-navy-900 border border-slate-700 p-4 text-slate-200 focus:border-gold-500 focus:outline-none transition-colors placeholder:text-slate-600"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-gold-500 flex items-center gap-2">
                                    <MessageSquare size={14} />
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    required
                                    rows={5}
                                    placeholder="How can we assist you?"
                                    className="w-full bg-navy-900 border border-slate-700 p-4 text-slate-200 focus:border-gold-500 focus:outline-none transition-colors placeholder:text-slate-600 resize-none"
                                />
                            </div>

                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-center gap-2 p-4 ${success
                                        ? 'bg-green-900/20 border border-green-500/30 text-green-400'
                                        : 'bg-red-900/20 border border-red-500/30 text-red-400'
                                        }`}
                                >
                                    {success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                    <span className="text-sm">{result}</span>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-slate-200 text-navy-950 font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="animate-pulse">Sending...</span>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center text-slate-600 text-xs border-t border-slate-900 mt-20">
                <p>© 2026 AMICUS AI. INTELLIGENT LEGAL SYSTEMS. NOT A HUMAN LAW FIRM.</p>
            </footer>
        </main>
    );
}
