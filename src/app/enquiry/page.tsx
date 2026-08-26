"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2,
    Shield,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Phone,
    Mail,
    User,
    FileText,
    Check,
    Layers,
    Cpu,
    Lock
} from "lucide-react";
import Image from "next/image";

const FEATURED_PROPERTIES = [
    "Enterprise AI & Cloud Infrastructure",
    "Fintech Trading & Analytics Platform",
    "EdgeLightWind Desktop Ecosystem",
    "Logistics Intelligence & Routing Engine",
    "Health Monitoring & Telemetry Suite",
    "Custom Web & Digital Architecture",
    "General Property / Project Consultation"
];

const HIGHLIGHTS = [
    {
        icon: Cpu,
        title: "High-Performance Systems",
        desc: "Built with Next.js, AI integration & low-latency cloud architecture."
    },
    {
        icon: Shield,
        title: "Enterprise Grade Security",
        desc: "Strict data privacy, end-to-end encryption & compliance standards."
    },
    {
        icon: Sparkles,
        title: "Engineered for Global Scale",
        desc: "Bespoke digital properties tailored for continuous growth."
    }
];

function EnquiryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectParam = searchParams.get("redirect") || "/";

    const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        property: FEATURED_PROPERTIES[0],
        message: ""
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMessage("");

        // Basic client validation
        if (!formData.name.trim()) {
            setErrorMessage("Please enter your full name.");
            return;
        }
        if (!formData.phone.trim()) {
            setErrorMessage("Please enter your phone number.");
            return;
        }
        if (!formData.email.trim() || !formData.email.includes("@")) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }
        if (!formData.message.trim()) {
            setErrorMessage("Please enter your requirements or message.");
            return;
        }

        setFormState("submitting");

        try {
            const res = await fetch("/api/enquiry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    property: formData.property,
                    message: formData.message,
                    redirect: redirectParam
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setFormState("error");
                setErrorMessage(data.error || "Failed to submit enquiry. Please check your details and try again.");
                return;
            }

            // Success state
            setFormState("success");

            // Redirect smoothly to target URL after brief feedback
            setTimeout(() => {
                const destination = data.redirect || redirectParam || "/";
                window.location.href = destination;
            }, 1200);
        } catch {
            setFormState("error");
            setErrorMessage("Network error occurred. Please try again.");
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between selection:bg-orange-500/30 selection:text-white">
            {/* Top Navigation Bar */}
            <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold tracking-tighter text-white">
                            ORYXEN
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 bg-orange-950/40 border border-orange-800/40 px-2 py-0.5 rounded-full">
                            Project Enquiry
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                        <Lock className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="hidden sm:inline">Access Gated Session</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl mx-auto px-6 py-12 lg:py-20 w-full flex items-center">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
                    
                    {/* Left Column: Property & Project Showcase */}
                    <div className="lg:col-span-6 space-y-8">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs font-mono text-zinc-300"
                            >
                                <Building2 className="w-3.5 h-3.5 text-orange-400" />
                                <span>Exclusive Project & Property Access</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]"
                            >
                                Experience our systems &amp; properties.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed max-w-xl"
                            >
                                Oryxen engineers high-performance digital products, intelligent infrastructure, and bespoke enterprise systems for global growth.
                            </motion.p>
                        </div>

                        {/* Project Visual Image Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-900/40 p-1 group shadow-2xl"
                        >
                            <div className="relative h-48 sm:h-56 w-full rounded-xl overflow-hidden bg-zinc-950">
                                <Image
                                    src="/new background.webp"
                                    alt="Oryxen Property Showcase"
                                    fill
                                    className="object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                
                                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                    <div>
                                        <p className="text-xs font-mono uppercase tracking-wider text-orange-400">Featured Architecture</p>
                                        <p className="text-base font-bold text-white">Global Edge &amp; Intelligent Product Systems</p>
                                    </div>
                                    <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-lg px-2.5 py-1 text-[11px] font-mono text-zinc-300">
                                        v2026.1
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Key Highlights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            className="grid sm:grid-cols-3 gap-4"
                        >
                            {HIGHLIGHTS.map((h, i) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-sm space-y-2 hover:border-zinc-800 transition-colors"
                                >
                                    <h.icon className="w-5 h-5 text-orange-400" />
                                    <h3 className="text-sm font-semibold text-white">{h.title}</h3>
                                    <p className="text-xs text-zinc-500 leading-relaxed">{h.desc}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Column: Enquiry Form Card */}
                    <div className="lg:col-span-6">
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
                        >
                            {/* Decorative ambient glow */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10 space-y-6">
                                {/* Card Header */}
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                                        Submit your details to continue
                                    </h2>
                                    <p className="text-sm text-zinc-400">
                                        Please complete this brief enquiry to unlock full access to the ORYXEN website.
                                    </p>
                                </div>

                                <AnimatePresence mode="wait">
                                    {formState === "success" ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                                <CheckCircle2 className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-bold text-white">Thank you. Your enquiry has been submitted.</h3>
                                                <p className="text-sm text-zinc-400">Redirecting you to the website...</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 pt-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Opening experience...</span>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            onSubmit={handleSubmit}
                                            className="space-y-4"
                                        >
                                            {formState === "error" && errorMessage && (
                                                <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono flex items-start gap-2">
                                                    <span>⚠️</span>
                                                    <span>{errorMessage}</span>
                                                </div>
                                            )}

                                            {/* Full Name */}
                                            <div className="space-y-1.5">
                                                <label htmlFor="enquiry-name" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5 text-zinc-500" />
                                                    Full Name <span className="text-orange-400">*</span>
                                                </label>
                                                <input
                                                    id="enquiry-name"
                                                    required
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                                    placeholder="Aditya Sharma"
                                                    className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/60 transition-all"
                                                />
                                            </div>

                                            {/* Phone & Email Grid */}
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {/* Phone Number */}
                                                <div className="space-y-1.5">
                                                    <label htmlFor="enquiry-phone" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                                                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                                                        Phone Number <span className="text-orange-400">*</span>
                                                    </label>
                                                    <input
                                                        id="enquiry-phone"
                                                        required
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                                        placeholder="+91 98765 43210"
                                                        className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/60 transition-all"
                                                    />
                                                </div>

                                                {/* Email Address */}
                                                <div className="space-y-1.5">
                                                    <label htmlFor="enquiry-email" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                                                        <Mail className="w-3.5 h-3.5 text-zinc-500" />
                                                        Email Address <span className="text-orange-400">*</span>
                                                    </label>
                                                    <input
                                                        id="enquiry-email"
                                                        required
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                                        placeholder="name@example.com"
                                                        className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/60 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            {/* Property / Project Selector */}
                                            <div className="space-y-1.5">
                                                <label htmlFor="enquiry-property" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                                                    <Layers className="w-3.5 h-3.5 text-zinc-500" />
                                                    Property / Project
                                                </label>
                                                <select
                                                    id="enquiry-property"
                                                    value={formData.property}
                                                    onChange={e => setFormData(p => ({ ...p, property: e.target.value }))}
                                                    className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/60 transition-all cursor-pointer"
                                                >
                                                    {FEATURED_PROPERTIES.map(item => (
                                                        <option key={item} value={item} className="bg-zinc-900 text-white">
                                                            {item}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Message or Requirement */}
                                            <div className="space-y-1.5">
                                                <label htmlFor="enquiry-message" className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                                                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                                                    Message or Requirement <span className="text-orange-400">*</span>
                                                </label>
                                                <textarea
                                                    id="enquiry-message"
                                                    required
                                                    rows={3}
                                                    value={formData.message}
                                                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                                                    placeholder="Briefly describe your project, timeline, or requirements..."
                                                    className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/60 transition-all resize-none"
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <div className="pt-3">
                                                <button
                                                    type="submit"
                                                    disabled={formState === "submitting"}
                                                    className="w-full bg-white text-black py-4 px-6 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.15)] group"
                                                >
                                                    {formState === "submitting" ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin text-black" />
                                                            <span>Validating &amp; Submitting...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Complete Enquiry &amp; Enter Site</span>
                                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Disclaimer */}
                                            <p className="text-[11px] text-zinc-500 text-center leading-relaxed pt-2">
                                                Your details will be used only for property-related communication.
                                            </p>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-900 py-6 text-center text-xs font-mono text-zinc-600">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p>© 2026 Oryxen Systems Private Limited. All rights reserved.</p>
                    <p>Protected Gate System</p>
                </div>
            </footer>
        </div>
    );
}

export default function EnquiryPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        }>
            <EnquiryContent />
        </Suspense>
    );
}
