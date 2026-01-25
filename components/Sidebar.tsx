'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Scale, FileText, ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { href: '/chat', label: 'Live Counsel', icon: Scale },
        { href: '/vault', label: 'Ghost Vault', icon: ShieldCheck },
        { href: '/contracts', label: 'Contract Forge', icon: FileText },
    ];

    const handleLogout = () => {
        localStorage.removeItem('amicus_user_id');
        router.push('/');
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-navy-900/95 backdrop-blur-md border-b border-slate-800 z-50 flex items-center justify-between p-4">
                <Link href="/" className="text-xl font-serif text-slate-100 tracking-wider">
                    AMICUS<span className="text-gold-500">.AI</span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-slate-200 hover:text-gold-400 transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="md:hidden fixed inset-0 top-16 bg-navy-950/98 backdrop-blur-md z-40"
                    >
                        <nav className="flex flex-col p-6 space-y-2">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.1 }}
                                >
                                    <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                        <button
                                            className={`flex items-center gap-3 w-full p-4 text-base font-medium rounded-sm transition-colors ${isActive(item.href)
                                                ? 'bg-navy-800/50 border border-gold-500/20 text-gold-400'
                                                : 'hover:bg-navy-800 text-slate-300'
                                                }`}
                                        >
                                            <item.icon size={20} />
                                            {item.label}
                                        </button>
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="pt-6 border-t border-slate-800 mt-6"
                            >
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="flex items-center gap-3 text-slate-400 hover:text-red-400 text-sm uppercase tracking-widest transition-colors p-4"
                                >
                                    <LogOut size={18} />
                                    Terminate Session
                                </button>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="w-64 bg-navy-900 border-r border-slate-800 flex-col hidden md:flex h-full">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-serif text-slate-100 tracking-wider">AMICUS<span className="text-gold-500">.AI</span></h2>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Counsel Active</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <button
                                className={`flex items-center gap-3 w-full p-3 text-sm font-medium rounded-sm transition-colors ${isActive(item.href)
                                    ? 'bg-navy-800/50 border border-gold-500/20 text-gold-400'
                                    : 'hover:bg-navy-800 text-slate-400'
                                    }`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </button>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-500 hover:text-red-400 text-xs uppercase tracking-widest transition-colors"
                    >
                        <LogOut size={14} />
                        Terminate Session
                    </button>
                </div>
            </aside>
        </>
    );
}
