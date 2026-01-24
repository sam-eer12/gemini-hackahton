"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User } from "lucide-react";
import { storeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "signup">(initialMode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setError("");
        setSuccess("");
    };

    const handleModeSwitch = (newMode: "login" | "signup") => {
        setMode(newMode);
        resetForm();
    };

    const validateForm = (): boolean => {
        if (!email || !password) {
            setError("Please fill in all required fields");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return false;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }

        if (mode === "signup") {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateForm()) return;

        setLoading(true);

        try {
            const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
            const body = mode === "login"
                ? { email, password }
                : { email, password, name };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            if (mode === "login") {
                // Store token and user ID
                storeToken(data.token);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('amicus_user_id', data.user.id);
                }
                setSuccess("Login successful! Redirecting...");

                // Redirect directly to chat
                setTimeout(() => {
                    router.push("/chat");
                }, 1000);
            } else {
                // Signup successful
                setSuccess("Account created! Please log in.");
                setTimeout(() => {
                    handleModeSwitch("login");
                }, 1500);
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-md bg-navy-900 border border-slate-800/50 p-8 shadow-2xl"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-serif text-slate-100 mb-2">
                                {mode === "login" ? "Welcome Back" : "Create Account"}
                            </h2>
                            <p className="text-slate-400 text-sm">
                                {mode === "login"
                                    ? "Sign in to access your legal counsel"
                                    : "Join AMICUS for elite legal assistance"}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {mode === "signup" && (
                                <div>
                                    <label className="block text-slate-300 text-sm mb-2 uppercase tracking-wider">
                                        Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-navy-950 border border-slate-800/50 text-slate-200 px-10 py-3 focus:outline-none focus:border-gold-500/50 transition-colors"
                                            placeholder="Your name"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-slate-300 text-sm mb-2 uppercase tracking-wider">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-navy-950 border border-slate-800/50 text-slate-200 px-10 py-3 focus:outline-none focus:border-gold-500/50 transition-colors"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm mb-2 uppercase tracking-wider">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-navy-950 border border-slate-800/50 text-slate-200 px-10 py-3 focus:outline-none focus:border-gold-500/50 transition-colors"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {mode === "signup" && (
                                <div>
                                    <label className="block text-slate-300 text-sm mb-2 uppercase tracking-wider">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-navy-950 border border-slate-800/50 text-slate-200 px-10 py-3 focus:outline-none focus:border-gold-500/50 transition-colors"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Error/Success Messages */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 text-sm">
                                    {success}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold py-3 uppercase tracking-widest text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
                            </button>
                        </form>

                        {/* Mode Switch */}
                        <div className="mt-6 text-center">
                            <p className="text-slate-400 text-sm">
                                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                                {" "}
                                <button
                                    onClick={() => handleModeSwitch(mode === "login" ? "signup" : "login")}
                                    className="text-gold-400 hover:text-gold-300 transition-colors font-medium"
                                >
                                    {mode === "login" ? "Sign Up" : "Sign In"}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
