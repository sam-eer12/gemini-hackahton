'use client';

import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
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
        <section id="contact" className="max-w-7xl mx-auto px-8 py-20 border-t border-slate-800/50 relative z-10 scroll-mt-24">
            <div className="flex justify-between items-end mb-12">
                <h2 className="text-3xl font-serif text-slate-200">Contact Us</h2>
                <div className="h-px w-full max-w-md bg-slate-800" />
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
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
                            <span>support@amicus.ai</span>
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
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
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
    );
};

export default Contact;
