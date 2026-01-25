'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Vault() {
    const [file, setFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem('amicus_user_id');
        if (!userId) {
            router.push('/');
        }
    }, [router]);

    async function handleAnalyze() {
        if (!file) return;

        setLoading(true);
        setAnalysis(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', localStorage.getItem('amicus_user_id') || '');

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setAnalysis(data.result);
        } catch (e) {
            console.error(e);
            alert('Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen bg-navy-950 text-slate-200 overflow-hidden font-sans">
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-8 mt-5 relative pt-16 md:pt-8">
                <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-gold-500/5 rounded-full blur-[100px]" />

                <div className="max-w-4xl mx-auto z-10 relative">
                    <h1 className="text-3xl font-serif text-slate-100 mb-2">The Ghost Vault</h1>
                    <p className="text-slate-400 mb-8 border-l border-gold-500/50 pl-4 py-1">
                        Deep packet analysis of legal documents. <br />
                        Files are streamed, analyzed, and incinerated. Zero retention.
                    </p>

                    <div className={`border-2 border-dashed rounded-lg p-12 text-center transition-all
              ${file ? 'border-gold-500/50 bg-gold-500/5' : 'border-slate-800 bg-navy-900/50 hover:border-slate-700'}
            `}>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id="file-upload"
                            accept="application/pdf,image/*,text/plain"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                            {file ? (
                                <>
                                    <FileText size={48} className="text-gold-500 mb-4" />
                                    <p className="text-gold-400 font-medium text-lg">{file.name}</p>
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleAnalyze(); }}
                                        disabled={loading}
                                        className="mt-6 px-8 py-3 bg-gold-500 text-navy-950 font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors flex items-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Execute Analysis'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Upload size={48} className="text-slate-500 mb-4" />
                                    <p className="text-slate-300 font-medium text-lg">Drop legal files here or click to browse</p>
                                    <p className="text-slate-500 text-sm mt-2">Supports PDF, IMG, TXT</p>
                                </>
                            )}
                        </label>
                    </div>

                    {analysis && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 bg-navy-900/80 border border-slate-800 p-8 rounded-sm"
                        >
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                                <CheckCircle className="text-green-500" size={20} />
                                <h3 className="text-lg font-bold text-slate-100 uppercase tracking-widest">Analysis Complete</h3>
                            </div>

                            <div className="prose prose-invert prose-p:leading-relaxed prose-headings:text-gold-400 prose-strong:text-slate-100">
                                <ReactMarkdown>
                                    {analysis}
                                </ReactMarkdown>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-2 text-gold-600 text-xs uppercase tracking-widest">
                                <AlertCircle size={14} />
                                Original file has been permanently deleted from memory.
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}
