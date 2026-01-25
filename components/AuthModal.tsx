"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ShieldCheck } from "lucide-react";
import { storeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: "login" | "signup";
}

// Declare global phoneEmailListener for phone.email widget
declare global {
    interface Window {
        phoneEmailListener?: (userObj: { user_json_url: string }) => void;
    }
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "signup">(initialMode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const [pendingUserData, setPendingUserData] = useState<any>(null);
    const router = useRouter();

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");

    // Setup phone.email callback
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.phoneEmailListener = async (userObj: { user_json_url: string }) => {
                console.log('Email verified! JSON URL:', userObj.user_json_url);

                if (!pendingUserData) {
                    setError('Verification data missing. Please try again.');
                    setIsVerifyingEmail(false);
                    return;
                }

                setLoading(true);

                try {
                    const response = await fetch('/api/auth/verify-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_json_url: userObj.user_json_url,
                            userData: pendingUserData,
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || 'Verification failed');
                    }

                    // Store token and user ID
                    storeToken(data.token);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('amicus_user_id', data.user.id);
                    }

                    setSuccess('Email verified! Welcome to AMICUS. Redirecting...');

                    // Redirect to chat
                    setTimeout(() => {
                        router.push('/chat');
                    }, 1500);
                } catch (err: any) {
                    setError(err.message || 'Verification failed');
                    setIsVerifyingEmail(false);
                } finally {
                    setLoading(false);
                }
            };
        }

        return () => {
            if (typeof window !== 'undefined') {
                delete window.phoneEmailListener;
            }
        };
    }, [pendingUserData, router]);

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setError("");
        setSuccess("");
        setIsVerifyingEmail(false);
        setPendingUserData(null);
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
            if (!name || name.trim().length === 0) {
                setError("Please enter your name");
                return false;
            }

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

        if (mode === "signup") {
            // For signup, store data and show verification widget
            setPendingUserData({ email, password, name });
            setIsVerifyingEmail(true);
            return;
        }

        // Login flow remains the same
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

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
                                {isVerifyingEmail ? "Verify Your Email" : mode === "login" ? "Welcome Back" : "Create Account"}
                            </h2>
                            <p className="text-slate-400 text-sm">
                                {isVerifyingEmail
                                    ? "Enter the OTP sent to your email"
                                    : mode === "login"
                                        ? "Sign in to access your legal counsel"
                                        : "Join AMICUS for elite legal assistance"}
                            </p>
                        </div>

                        {/* Email Verification Widget */}
                        {isVerifyingEmail && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="bg-navy-950 border border-gold-500/30 p-6 text-center">
                                    <ShieldCheck className="text-gold-500 mx-auto mb-4" size={48} />
                                    <p className="text-slate-300 mb-4">
                                        Verifying: <span className="text-gold-400 font-medium">{pendingUserData?.email}</span>
                                    </p>
                                    <div
                                        className="pe_verify_email"
                                        data-client-id="18718410808713984467"
                                        data-phone-email-listener="phoneEmailListener"
                                    />
                                </div>

                                <button
                                    onClick={() => setIsVerifyingEmail(false)}
                                    className="w-full border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 py-3 uppercase tracking-widest text-sm transition-colors"
                                >
                                    Cancel Verification
                                </button>

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
                            </motion.div>
                        )}

                        {/* Form - Only show if not verifying email */}
                        {!isVerifyingEmail && (
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
                                    {loading ? "Processing..." : mode === "login" ? "Sign In" : "Continue to Verification"}
                                </button>
                            </form>
                        )}

                        {/* Mode Switch - Only show if not verifying */}
                        {!isVerifyingEmail && (
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
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
