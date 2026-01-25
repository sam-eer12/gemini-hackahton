'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    onLoginClick?: () => void;
    showAuthButton?: boolean;
}

export default function Navbar({ onLoginClick, showAuthButton = true }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/about', label: 'The Firm' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <nav className="flex justify-between items-center p-6 md:p-8 max-w-7xl mx-auto z-20 relative">
            {/* Logo */}
            <Link href="/" className="text-xl md:text-2xl font-serif font-bold text-slate-100 tracking-wider">
                AMICUS<span className="text-gold-500">.AI</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase text-slate-400">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="hover:text-gold-400 transition-colors"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* Desktop Auth Button */}
            {showAuthButton && onLoginClick && (
                <button
                    onClick={onLoginClick}
                    className="hidden md:block px-6 py-2 border border-gold-600/30 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500 transition-all duration-500 rounded-none uppercase text-xs tracking-[0.2em]"
                >
                    Login / Sign Up
                </button>
            )}

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-200 hover:text-gold-400 transition-colors z-50"
                aria-label="Toggle menu"
            >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-navy-950/95 backdrop-blur-md z-40 md:hidden"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="flex flex-col items-center justify-center h-full gap-8"
                        >
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-2xl font-serif text-slate-100 hover:text-gold-400 transition-colors uppercase tracking-widest"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}

                            {showAuthButton && onLoginClick && (
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onLoginClick();
                                    }}
                                    className="mt-4 px-8 py-3 border border-gold-600/30 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500 transition-all duration-500 uppercase text-sm tracking-[0.2em]"
                                >
                                    Login / Sign Up
                                </motion.button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
