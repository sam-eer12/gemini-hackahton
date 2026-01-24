'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Scale, FileText, ShieldCheck, LogOut } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 bg-navy-900 border-r border-slate-800 flex flex-col hidden md:flex h-full">
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-serif text-slate-100 tracking-wider">AMICUS<span className="text-gold-500">.AI</span></h2>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Counsel Active</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link href="/chat">
                    <button className={`flex items-center gap-3 w-full p-3 text-sm font-medium rounded-sm transition-colors ${isActive('/chat') ? 'bg-navy-800/50 border border-gold-500/20 text-gold-400' : 'hover:bg-navy-800 text-slate-400'}`}>
                        <Scale size={16} />
                        Live Counsel
                    </button>
                </Link>

                <Link href="/vault">
                    <button className={`flex items-center gap-3 w-full p-3 text-sm font-medium rounded-sm transition-colors ${isActive('/vault') ? 'bg-navy-800/50 border border-gold-500/20 text-gold-400' : 'hover:bg-navy-800 text-slate-400'}`}>
                        <ShieldCheck size={16} />
                        Ghost Vault
                    </button>
                </Link>

                {/* Placeholder for Contracts */}
                <Link href="/contracts">
                    <button className={`flex items-center gap-3 w-full p-3 text-sm font-medium rounded-sm transition-colors ${isActive('/contracts') ? 'bg-navy-800/50 border border-gold-500/20 text-gold-400' : 'hover:bg-navy-800 text-slate-400'}`}>
                        <FileText size={16} />
                        Contract Forge
                    </button>
                </Link>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => {
                        localStorage.removeItem('amicus_user_id');
                        router.push('/');
                    }}
                    className="flex items-center gap-2 text-slate-500 hover:text-red-400 text-xs uppercase tracking-widest transition-colors"
                >
                    <LogOut size={14} />
                    Terminate Session
                </button>
            </div>
        </aside>
    );
}
