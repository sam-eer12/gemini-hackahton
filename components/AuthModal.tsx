"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ShieldCheck, Loader2, MapPin } from "lucide-react";
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
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [pendingUserData, setPendingUserData] = useState<any>(null);
    const [resendTimer, setResendTimer] = useState(0);
    const router = useRouter();

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");

    // Countries and states data
    const countriesWithStates: Record<string, string[]> = {
        "India": [
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
            "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
            "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
            "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
            "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
            "Delhi", "Jammu and Kashmir", "Ladakh"
        ],
        "United States": [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
            "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
            "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
            "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
            "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
            "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
            "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
            "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
            "Washington", "West Virginia", "Wisconsin", "Wyoming"
        ],
        "United Kingdom": [
            "England", "Scotland", "Wales", "Northern Ireland"
        ],
        "Canada": [
            "Alberta", "British Columbia", "Manitoba", "New Brunswick",
            "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
            "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"
        ],
        "Australia": [
            "New South Wales", "Queensland", "South Australia", "Tasmania",
            "Victoria", "Western Australia", "Australian Capital Territory", "Northern Territory"
        ],
        "Other": []
    };

    // OTP input states
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Send OTP to email
    const sendOTP = async () => {
        if (!pendingUserData) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pendingUserData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send OTP');
            }

            setOtpSent(true);
            setResendTimer(60);

            // Show OTP for testing (remove in production)
            if (data.otp) {
                setSuccess(`Code sent!`);
            } else {
                setSuccess('Verification code sent to your email!');
            }

            // Focus first OTP input
            setTimeout(() => {
                otpInputRefs.current[0]?.focus();
            }, 100);
        } catch (err: any) {
            setError(err.message || 'Failed to send verification code');
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const verifyOTP = async () => {
        const otp = otpDigits.join('');

        if (otp.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: pendingUserData.email,
                    otp,
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

            // Redirect new users to terms page first
            setTimeout(() => {
                router.push('/terms');
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Verification failed');
            setOtpDigits(["", "", "", "", "", ""]);
        } finally {
            setLoading(false);
        }
    };

    // Auto-verify when all digits are entered
    useEffect(() => {
        if (otpSent && otpDigits.every(d => d !== '') && !loading) {
            verifyOTP();
        }
    }, [otpDigits, otpSent]);

    // Handle OTP input change
    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const digits = value.replace(/\D/g, '').slice(0, 6).split('');
            const newOtpDigits = ["", "", "", "", "", ""];
            digits.forEach((digit, i) => {
                if (i < 6) {
                    newOtpDigits[i] = digit;
                }
            });
            setOtpDigits(newOtpDigits);
            const nextIndex = Math.min(digits.length, 5);
            otpInputRefs.current[nextIndex]?.focus();
        } else {
            const newOtpDigits = [...otpDigits];
            newOtpDigits[index] = value;
            setOtpDigits(newOtpDigits);
            if (value && index < 5) {
                otpInputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setCountry("");
        setState("");
        setError("");
        setSuccess("");
        setIsVerifyingEmail(false);
        setOtpSent(false);
        setPendingUserData(null);
        setOtpDigits(["", "", "", "", "", ""]);
        setResendTimer(0);
    };

    // Check if email already exists
    const checkEmailExists = async (emailToCheck: string): Promise<boolean> => {
        try {
            setCheckingEmail(true);
            const response = await fetch('/api/auth/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailToCheck }),
            });
            const data = await response.json();
            return data.exists;
        } catch (err) {
            console.error('Error checking email:', err);
            return false;
        } finally {
            setCheckingEmail(false);
        }
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

            if (!country) {
                setError("Please select your country");
                return false;
            }

            if (!state) {
                setError("Please select your state/province");
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
            // Check if email already exists
            setLoading(true);
            const emailExists = await checkEmailExists(email);
            setLoading(false);

            if (emailExists) {
                setError("An account with this email already exists. Please sign in instead.");
                return;
            }

            // For signup, store data and show verification screen
            setPendingUserData({ email, password, name, country, state });
            setIsVerifyingEmail(true);
            return;
        }

        // Login flow
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

            // Check if user has completed onboarding (accepted terms)
            const redirectPath = data.user.onboarding_complete ? "/chat" : "/terms";
            setTimeout(() => {
                router.push(redirectPath);
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
                        className="relative w-full max-w-md bg-navy-900 border border-slate-800/50 p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            <X size={18} />
                        </button>

                        {/* Header */}
                        <div className="mb-5">
                            <h2 className="text-2xl font-serif text-slate-100 mb-1">
                                {isVerifyingEmail ? "Verify Your Email" : mode === "login" ? "Welcome Back" : "Create Account"}
                            </h2>
                            <p className="text-slate-400 text-xs">
                                {isVerifyingEmail
                                    ? otpSent
                                        ? "Enter the 6-digit code sent to your email"
                                        : "We'll send you a verification code"
                                    : mode === "login"
                                        ? "Sign in to access your legal counsel"
                                        : "Join AMICUS for elite legal assistance"}
                            </p>
                        </div>

                        {/* Email Verification with OTP */}
                        {isVerifyingEmail && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="bg-navy-950 border border-gold-500/30 p-6 text-center">
                                    <ShieldCheck className="text-gold-500 mx-auto mb-4" size={48} />
                                    <p className="text-slate-300 mb-2">
                                        {otpSent ? "Enter verification code" : "Verify your email address"}
                                    </p>
                                    <p className="text-gold-400 font-medium mb-4">
                                        {pendingUserData?.email}
                                    </p>

                                    {!otpSent ? (
                                        <>
                                            <p className="text-slate-400 text-sm mb-6">
                                                Click the button below to receive a verification code
                                            </p>
                                            <button
                                                onClick={sendOTP}
                                                disabled={loading}
                                                className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold py-3 uppercase tracking-widest text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={18} />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Mail size={18} />
                                                        Send Verification Code
                                                    </>
                                                )}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {/* OTP Input Boxes */}
                                            <div className="flex justify-center gap-2 mb-6">
                                                {otpDigits.map((digit, index) => (
                                                    <input
                                                        key={index}
                                                        ref={(el) => { otpInputRefs.current[index] = el; }}
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={6}
                                                        value={digit}
                                                        onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                        onPaste={(e) => {
                                                            e.preventDefault();
                                                            const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
                                                            handleOtpChange(0, pastedData);
                                                        }}
                                                        className="w-12 h-14 text-center text-2xl font-bold bg-navy-950 border border-slate-700 text-slate-100 focus:border-gold-500 focus:outline-none transition-colors"
                                                        disabled={loading}
                                                    />
                                                ))}
                                            </div>

                                            {loading && (
                                                <div className="flex items-center justify-center gap-2 text-gold-400 mb-4">
                                                    <Loader2 className="animate-spin" size={20} />
                                                    <span>Verifying...</span>
                                                </div>
                                            )}

                                            {/* Resend OTP */}
                                            <div className="text-sm">
                                                {resendTimer > 0 ? (
                                                    <p className="text-slate-500">
                                                        Resend code in {resendTimer}s
                                                    </p>
                                                ) : (
                                                    <button
                                                        onClick={sendOTP}
                                                        disabled={loading}
                                                        className="text-gold-400 hover:text-gold-300 transition-colors"
                                                    >
                                                        Didn't receive code? Resend
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        setIsVerifyingEmail(false);
                                        setOtpSent(false);
                                        setOtpDigits(["", "", "", "", "", ""]);
                                        setError("");
                                        setSuccess("");
                                    }}
                                    className="w-full border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 py-3 uppercase tracking-widest text-sm transition-colors"
                                    disabled={loading}
                                >
                                    ← Back to Signup
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
                            <form onSubmit={handleSubmit} className="space-y-3">
                                {mode === "signup" && (
                                    <div>
                                        <label className="block text-slate-300 text-xs mb-1.5 uppercase tracking-wider">
                                            Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-navy-950 border border-slate-800/50 text-slate-200 text-sm px-9 py-2.5 focus:outline-none focus:border-gold-500/50 transition-colors"
                                                placeholder="Your name"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-slate-300 text-xs mb-1.5 uppercase tracking-wider">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-navy-950 border border-slate-800/50 text-slate-200 text-sm px-9 py-2.5 focus:outline-none focus:border-gold-500/50 transition-colors"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-300 text-xs mb-1.5 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-navy-950 border border-slate-800/50 text-slate-200 text-sm px-9 py-2.5 focus:outline-none focus:border-gold-500/50 transition-colors"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                {mode === "signup" && (
                                    <div>
                                        <label className="block text-slate-300 text-xs mb-1.5 uppercase tracking-wider">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-navy-950 border border-slate-800/50 text-slate-200 text-sm px-9 py-2.5 focus:outline-none focus:border-gold-500/50 transition-colors"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {mode === "signup" && (
                                    <div>
                                        <label className="block text-slate-300 text-xs mb-1.5 uppercase tracking-wider">
                                            Country
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                            <select
                                                value={country}
                                                onChange={(e) => {
                                                    setCountry(e.target.value);
                                                    setState(""); // Reset state when country changes
                                                }}
                                                className="w-full bg-navy-950 border border-slate-800/50 text-slate-200 text-sm px-9 py-2.5 focus:outline-none focus:border-gold-500/50 transition-colors appearance-none cursor-pointer"
                                                required
                                            >
                                                <option value="" disabled>Select your country</option>
                                                {Object.keys(countriesWithStates).map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {mode === "signup" && country && country !== "Other" && (
                                    <div>
                                        <label className="block text-slate-300 text-xs mb-1.5 uppercase tracking-wider">
                                            State / Province
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                            <select
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                                className="w-full bg-navy-950 border border-slate-800/50 text-slate-200 text-sm px-9 py-2.5 focus:outline-none focus:border-gold-500/50 transition-colors appearance-none cursor-pointer"
                                                required
                                            >
                                                <option value="" disabled>Select your state</option>
                                                {countriesWithStates[country]?.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {mode === "signup" && country === "Other" && (
                                    <div>
                                        <label className="block text-slate-300 text-xs mb-1.5 uppercase tracking-wider">
                                            State, Country
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                            <input
                                                type="text"
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                                className="w-full bg-navy-950 border border-slate-800/50 text-slate-200 text-sm px-9 py-2.5 focus:outline-none focus:border-gold-500/50 transition-colors"
                                                placeholder="Enter your state or region"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Error/Success Messages */}
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 text-xs">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-2 text-xs">
                                        {success}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || checkingEmail}
                                    className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold py-2.5 uppercase tracking-widest text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {(loading || checkingEmail) && <Loader2 className="animate-spin" size={16} />}
                                    {loading || checkingEmail
                                        ? "Checking..."
                                        : mode === "login"
                                            ? "Sign In"
                                            : "Continue to Verification"}
                                </button>
                            </form>
                        )}

                        {/* Mode Switch - Only show if not verifying */}
                        {!isVerifyingEmail && (
                            <div className="mt-4 text-center">
                                <p className="text-slate-400 text-xs">
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
