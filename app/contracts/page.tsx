'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { PenTool, FileSearch, Loader2, Download, AlertTriangle } from 'lucide-react';
import Markdown from 'react-markdown'; 
import { motion } from 'framer-motion';

export default function Contracts() {
    const [activeTab, setActiveTab] = useState<'forge' | 'scan'>('forge');
    const [prompt, setPrompt] = useState('');
    const [generatedContract, setGeneratedContract] = useState('');
    const [loading, setLoading] = useState(false);

    const [scanFile, setScanFile] = useState<File | null>(null);
    const [scanResult, setScanResult] = useState('');

    async function handleForge() {
        if (!prompt.trim()) return;
        setLoading(true);
        setGeneratedContract('');

        try {
            const res = await fetch('/api/forge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: localStorage.getItem('amicus_user_id'),
                    prompt
                })
            });
            const data = await res.json();
            setGeneratedContract(data.contract);
        } catch (e) {
            console.error(e);
            alert('Forge failed.');
        } finally {
            setLoading(false);
        }
    }

    async function handleScan() {
        if (!scanFile) return;
        setLoading(true);
        setScanResult('');

        const formData = new FormData();
        formData.append('file', scanFile);
        formData.append('userId', localStorage.getItem('amicus_user_id') || '');
        formData.append('mode', 'contract_scan'); 

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            setScanResult(data.result);
        } catch (e) {
            console.error(e);
            alert('Scan failed.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen bg-navy-950 text-slate-200 overflow-hidden font-sans">
            <Sidebar />

            <main className="flex-1 flex flex-col h-full relative">
                <div className="absolute top-0 left-0 w-full h-75 bg-linear-gradient-to-b from-navy-900 to-transparent pointer-events-none" />

                <div className="p-8 pb-0 z-10">
                    <h1 className="text-3xl font-serif text-slate-100 mb-6">Contract Suite</h1>
                    <div className="flex gap-8 border-b border-slate-800">
                        <button
                            onClick={() => setActiveTab('forge')}
                            className={`pb-4 text-sm uppercase tracking-widest font-medium transition-colors border-b-2 
                ${activeTab === 'forge' ? 'border-gold-500 text-gold-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`
                            }
                        >
                            Contract Forge
                        </button>
                        <button
                            onClick={() => setActiveTab('scan')}
                            className={`pb-4 text-sm uppercase tracking-widest font-medium transition-colors border-b-2 
                ${activeTab === 'scan' ? 'border-gold-500 text-gold-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`
                            }
                        >
                            Red Flag Scanner
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 z-10">
                    {activeTab === 'forge' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
                            <div className="bg-navy-900 p-8 border border-slate-800 rounded-sm">
                                <label className="block text-xs uppercase tracking-widest text-gold-500 mb-4">Input Parameters</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe the agreement (e.g., 'Freelance web design contract for a client in New York using Delaware Law, $5000 fixed fee, 50% upfront...')"
                                    className="w-full h-32 bg-navy-950 border border-slate-700 p-4 text-slate-200 focus:border-gold-500 focus:outline-none placeholder:text-slate-600 resize-none mb-6"
                                />
                                <button
                                    onClick={handleForge}
                                    disabled={loading || !prompt}
                                    className="px-8 py-3 bg-gold-500 text-navy-950 font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <PenTool size={18} />}
                                    Forge Contract
                                </button>
                            </div>

                            {generatedContract && (
                                <div className="bg-white text-navy-950 p-12 shadow-2xl rounded-sm min-h-125 relative">
                                    <div className="absolute top-4 right-4 text-slate-400 cursor-pointer hover:text-navy-800">
                                        <Download size={20} />
                                    </div>
                                    <div className="prose prose-sm max-w-none font-serif">
                                        <Markdown>{generatedContract}</Markdown>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'scan' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto text-center pt-12">
                            <div className={`border-2 border-dashed rounded-lg p-12 mb-8 transition-all
                  ${scanFile ? 'border-gold-500/50 bg-gold-500/5' : 'border-slate-800 bg-navy-900/50 hover:border-slate-700'}
                `}>
                                <input
                                    type="file"
                                    onChange={(e) => setScanFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="scan-upload"
                                    accept=".pdf,.txt,.docx"
                                />
                                <label htmlFor="scan-upload" className="cursor-pointer">
                                    <FileSearch size={48} className="text-gold-500 mx-auto mb-4" />
                                    <p className="text-xl text-slate-300 font-medium mb-2">{scanFile ? scanFile.name : "Upload Contract for Review"}</p>
                                    <p className="text-sm text-slate-500">System will highlight traps, indemnity risks, and jurisdiction mismatches.</p>
                                </label>
                            </div>

                            {scanFile && !loading && !scanResult && (
                                <button
                                    onClick={handleScan}
                                    className="px-8 py-3 bg-red-900/80 border border-red-500/50 text-red-200 font-bold uppercase tracking-widest hover:bg-red-800 transition-colors inline-flex items-center gap-2"
                                >
                                    <AlertTriangle size={18} />
                                    Initiate Red Flag Scan
                                </button>
                            )}

                            {loading && <div className="text-gold-500 animate-pulse text-sm uppercase tracking-widest">Scanning clauses...</div>}

                            {scanResult && (
                                <div className="text-left bg-navy-900/80 border border-red-900/30 p-8 mt-8">
                                    <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                                        <AlertTriangle className="text-red-500" size={20} />
                                        <h3 className="text-lg font-bold text-slate-100 uppercase tracking-widest">Risk Assessment</h3>
                                    </div>
                                    <div className="prose prose-invert prose-headings:text-red-400 prose-strong:text-red-200">
                                        <Markdown>
                                            {scanResult}
                                        </Markdown>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}