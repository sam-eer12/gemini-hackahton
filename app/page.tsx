"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Scale, ShieldCheck, FileText, Globe } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import Prism from "@/app/animations/Prism";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-navy-950 text-slate-200 overflow-hidden relative">
      {/* Prism Animation Background */}
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
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-2xl font-serif font-bold text-slate-100 tracking-wider">
          AMICUS<span className="text-gold-500">.AI</span>
        </div>
        <div className="flex gap-8 text-sm font-medium tracking-widest uppercase text-slate-400">
          <Link href="/terms" className="hover:text-gold-400 transition-colors">Protocol</Link>
          <Link href="/about" className="hover:text-gold-400 transition-colors">The Firm</Link>
          <Link href="/contact" className="hover:text-gold-400 transition-colors">Contact</Link>
        </div>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-2 border border-gold-600/30 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500 transition-all duration-500 rounded-none uppercase text-xs tracking-[0.2em]"
        >
          Login / Sign Up
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 pt-20 pb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-6xl md:text-8xl font-serif font-medium leading-[1.1] text-slate-100 mb-8">
            Jurisdiction-Aware <br />
            <span className="text-slate-400 italic">Precognition.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed font-light border-l border-gold-600/50 pl-6 mb-12">
            The world's first elite legal consultancy powered by Gemini 3.
            Zero retention. Absolute privacy. Instant strategy tailored to your specific local laws.
          </p>

          <Link href="/onboarding">
            <button className="group relative px-8 py-4 bg-slate-100 text-navy-950 hover:bg-gold-500 transition-all duration-300 font-bold tracking-widest uppercase text-sm">
              Initialize Counsel
              <span className="absolute bottom-0 right-0 w-full h-px bg-navy-950 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Bento Grid Services */}
      <section className="max-w-7xl mx-auto px-8 py-20 border-t border-slate-800/50">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-serif text-slate-200">Our Capabilities</h2>
          <div className="h-px w-full max-w-md bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">

          {/* Card 1: Live Counsel (Large) */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="md:col-span-2 row-span-1 bg-navy-900/50 border border-slate-800/50 p-8 flex flex-col justify-between hover:border-gold-500/30 transition-colors group"
          >
            <div className="p-3 bg-navy-800 w-fit rounded-sm group-hover:bg-gold-500/20 group-hover:text-gold-400 transition-colors">
              <Scale size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-serif text-slate-100 mb-2">Live Counsel</h3>
              <p className="text-slate-400 text-sm">Real-time legal strategy conversations powered by Gemini 3. Direct answers, no ambiguity.</p>
            </div>
          </motion.div>

          {/* Card 2: Jurisdiction */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-navy-800/30 border border-slate-800/50 p-8 flex flex-col justify-between hover:border-gold-500/30 transition-colors group"
          >
            <div className="p-3 bg-navy-900 w-fit rounded-sm group-hover:bg-gold-500/20 group-hover:text-gold-400 transition-colors">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-xl font-serif text-slate-100 mb-2">Local Law</h3>
              <p className="text-slate-400 text-sm">Automatically adapts to your Country and State specific statutes.</p>
            </div>
          </motion.div>

          {/* Card 3: The Vault */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-navy-800/30 border border-slate-800/50 p-8 flex flex-col justify-between hover:border-gold-500/30 transition-colors group"
          >
            <div className="p-3 bg-navy-900 w-fit rounded-sm group-hover:bg-gold-500/20 group-hover:text-gold-400 transition-colors">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-xl font-serif text-slate-100 mb-2">The Ghost Vault</h3>
              <p className="text-slate-400 text-sm">Files are analyzed in-stream and immediately discarded. Zero retention policy.</p>
            </div>
          </motion.div>

          {/* Card 4: Contract Forge (Large) */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="md:col-span-2 bg-linear-to-br from-navy-900 to-navy-800 border border-slate-800/50 p-8 flex flex-col justify-between hover:border-gold-500/30 transition-colors group"
          >
            <div className="p-3 bg-navy-950 w-fit rounded-sm group-hover:bg-gold-500/20 group-hover:text-gold-400 transition-colors">
              <FileText size={24} />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-serif text-slate-100 mb-2">Contract Forge</h3>
                <p className="text-slate-400 text-sm">Generate bulletproof agreements or scan existing ones for "traps" in seconds.</p>
              </div>
              <div className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity text-2xl">→</div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 text-center text-slate-600 text-xs border-t border-slate-900 mt-20">
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
