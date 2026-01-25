"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Scale, Shield, Zap, Globe2, ArrowLeft } from "lucide-react";
import Prism from "@/app/animations/Prism";
import AuthModal from "@/components/AuthModal";

export default function AboutPage() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <main className="min-h-screen bg-navy-950 text-slate-200">
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
            <div className="absolute top-0 left-0 w-full h-150 bg-linear-to-b from-navy-900/50 to-transparent pointer-events-none" />
            <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] bg-gold-500/10 rounded-full blur-[120px]" />

            {/* Navigation */}
            <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto z-10 relative">
                <Link href="/" className="flex items-center gap-3 text-slate-400 hover:text-gold-400 transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm uppercase tracking-widest">Back</span>
                </Link>
                <div className="text-2xl font-serif font-bold text-slate-100 tracking-wider">
                    AMICUS<span className="text-gold-500">.AI</span>
                </div>
                <div className="w-20" /> {/* Spacer for centering */}
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-8 pt-12 pb-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-gold-500 mb-6 font-medium">The Firm</p>
                    <h1 className="text-5xl md:text-7xl font-serif font-medium leading-[1.1] text-slate-100 mb-8">
                        Elite Legal Intelligence,{" "}
                        <span className="text-slate-400 italic">Reimagined.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed font-light border-l border-gold-600/50 pl-6">
                        We are not a traditional law firm. We are a next-generation legal consultancy
                        powered by Gemini 3, combining jurisdiction-aware AI precision with absolute
                        client privacy to deliver instant, actionable legal strategy.
                    </p>
                </motion.div>
            </section>

            {/* Mission Statement */}
            <section className="max-w-7xl mx-auto px-8 py-16 border-t border-slate-800/50">
                <div className="grid md:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-serif text-slate-100 mb-6">Our Mission</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Traditional legal services are slow, expensive, and opaque. We believe
                            everyone deserves instant access to jurisdiction-specific legal guidance
                            without sacrificing privacy or precision.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            By harnessing the power of advanced AI and maintaining a strict zero-retention
                            policy, we provide elite-level legal consultancy that adapts to your local
                            laws in real-time—no matter where you are.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-navy-900/50 border border-slate-800/50 p-8"
                    >
                        <blockquote className="text-2xl font-serif italic text-slate-300 leading-relaxed">
                            "Legal counsel should be instant, intelligent, and impenetrable.
                            We've built that future."
                        </blockquote>
                        <p className="text-sm text-gold-500 mt-6 uppercase tracking-widest">— Amicus AI Founding Principle</p>
                    </motion.div>
                </div>
            </section>

            {/* Core Values Grid */}
            <section className="max-w-7xl mx-auto px-8 py-20 border-t border-slate-800/50">
                <h2 className="text-3xl font-serif text-slate-100 mb-12">Our Core Principles</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Value 1 */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-navy-900/30 border border-slate-800/50 p-8 hover:border-gold-500/30 transition-all group"
                    >
                        <div className="p-3 bg-navy-800 w-fit rounded-sm mb-6 group-hover:bg-gold-500/20 transition-colors">
                            <Shield className="text-gold-500" size={28} />
                        </div>
                        <h3 className="text-xl font-serif text-slate-100 mb-3">Absolute Privacy</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Zero retention policy. Your files are analyzed in-stream and immediately
                            discarded. No servers. No storage. No compromise.
                        </p>
                    </motion.div>

                    {/* Value 2 */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-navy-900/30 border border-slate-800/50 p-8 hover:border-gold-500/30 transition-all group"
                    >
                        <div className="p-3 bg-navy-800 w-fit rounded-sm mb-6 group-hover:bg-gold-500/20 transition-colors">
                            <Globe2 className="text-gold-500" size={28} />
                        </div>
                        <h3 className="text-xl font-serif text-slate-100 mb-3">Jurisdiction-Aware</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Our AI automatically adapts to country and state-specific statutes, ensuring
                            every recommendation is tailored to your exact legal jurisdiction.
                        </p>
                    </motion.div>

                    {/* Value 3 */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-navy-900/30 border border-slate-800/50 p-8 hover:border-gold-500/30 transition-all group"
                    >
                        <div className="p-3 bg-navy-800 w-fit rounded-sm mb-6 group-hover:bg-gold-500/20 transition-colors">
                            <Zap className="text-gold-500" size={28} />
                        </div>
                        <h3 className="text-xl font-serif text-slate-100 mb-3">Instant Precision</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            No waiting days for legal opinions. Receive jurisdiction-specific strategies,
                            contract analysis, and regulatory guidance in seconds.
                        </p>
                    </motion.div>

                    {/* Value 4 */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-navy-900/30 border border-slate-800/50 p-8 hover:border-gold-500/30 transition-all group"
                    >
                        <div className="p-3 bg-navy-800 w-fit rounded-sm mb-6 group-hover:bg-gold-500/20 transition-colors">
                            <Scale className="text-gold-500" size={28} />
                        </div>
                        <h3 className="text-xl font-serif text-slate-100 mb-3">Elite-Level Expertise</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Powered by Gemini 3's advanced reasoning, we deliver legal intelligence
                            that rivals top-tier law firms—at a fraction of the cost and time.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Technology Stack */}
            <section className="max-w-7xl mx-auto px-8 py-20 border-t border-slate-800/50">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl font-serif text-slate-200">The Technology</h2>
                    <div className="h-px w-full max-w-md bg-slate-800" />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <div className="text-gold-500 font-bold text-lg">01</div>
                        <h3 className="text-lg font-serif text-slate-100">Gemini 3 Core</h3>
                        <p className="text-slate-400 text-sm">
                            Advanced AI reasoning engine with multi-turn context, real-time research,
                            and jurisdiction-specific legal knowledge.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="text-gold-500 font-bold text-lg">02</div>
                        <h3 className="text-lg font-serif text-slate-100">Ephemeral Architecture</h3>
                        <p className="text-slate-400 text-sm">
                            Stream-based file analysis with zero persistent storage. Your data
                            never touches a disk.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="text-gold-500 font-bold text-lg">03</div>
                        <h3 className="text-lg font-serif text-slate-100">Localized Legal DB</h3>
                        <p className="text-slate-400 text-sm">
                            Real-time access to state and federal statutes, case law, and regulatory
                            updates across India and 190+ countries.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-8 py-20 border-t border-slate-800/50">
                <div className="bg-linear-to-r from-navy-900 to-navy-800 border border-gold-600/20 p-16 text-center">
                    <h2 className="text-4xl font-serif text-slate-100 mb-6">Ready to Experience the Future?</h2>
                    <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
                        Join thousands of professionals who trust Amicus AI for instant,
                        jurisdiction-aware legal intelligence.
                    </p>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="px-8 py-4 bg-gold-500 text-navy-950 hover:bg-gold-400 transition-all duration-300 font-bold tracking-widest uppercase text-sm"
                    >
                        Initialize Counsel
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center text-slate-600 text-xs border-t border-slate-900 mt-12">
                <p>© 2026 AMICUS AI. INTELLIGENT LEGAL SYSTEMS. NOT A HUMAN LAW FIRM.</p>
            </footer>

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode="login"
            />
        </main>
    );
}
