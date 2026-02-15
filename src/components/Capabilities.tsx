"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";

export default function Capabilities() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section id="capabilities" ref={sectionRef} className="py-32 bg-black border-b border-zinc-900">
            <div className="container-width">

                {/* Header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest bg-zinc-800/50 px-3 py-1.5 rounded-sm border border-zinc-700/50 inline-block mb-6">
                        What We Deliver
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Everything you need to ship.
                    </h2>
                    <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                        Best of breed solutions. Integrated as a complete system.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* Card 1: Web Development - Large */}
                    <motion.div
                        className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800/50 overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="p-6 pb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <path d="M3 9h18" />
                                        <circle cx="7" cy="6" r="1" fill="currentColor" />
                                        <circle cx="10" cy="6" r="1" fill="currentColor" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Web Development</h3>
                            </div>
                            <p className="text-zinc-400 text-sm mb-2 font-medium">Production-grade web applications</p>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                Built with React, Next.js, and modern frameworks. Optimized for speed, SEO, and scalability.
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="px-3 py-1.5 bg-zinc-800/80 text-zinc-300 rounded-full border border-zinc-700/50">SSR/SSG</span>
                                <span className="px-3 py-1.5 bg-zinc-800/80 text-zinc-300 rounded-full border border-zinc-700/50">Edge Ready</span>
                                <span className="px-3 py-1.5 bg-zinc-800/80 text-zinc-300 rounded-full border border-zinc-700/50">API Routes</span>
                            </div>
                        </div>
                        {mounted && (
                            <div className="h-40 relative border-t border-zinc-800/30 bg-zinc-950/50">
                                <WebDevAnimation />
                            </div>
                        )}
                    </motion.div>

                    {/* Card 2: Mobile Apps */}
                    <motion.div
                        className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800/50 overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="p-6 pb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="5" y="2" width="14" height="20" rx="3" />
                                        <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Mobile Apps</h3>
                            </div>
                            <p className="text-zinc-400 text-sm mb-2 font-medium">Cross-platform native experiences</p>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                React Native & Expo. One codebase, iOS & Android.
                            </p>
                        </div>
                        {mounted && (
                            <div className="h-36 relative border-t border-zinc-800/30 bg-zinc-950/50 flex items-center justify-center">
                                <MobileAnimation />
                            </div>
                        )}
                    </motion.div>

                    {/* Card 3: Backend Systems */}
                    <motion.div
                        className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800/50 overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="p-6 pb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <ellipse cx="12" cy="6" rx="8" ry="3" />
                                        <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
                                        <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Backend Systems</h3>
                            </div>
                            <p className="text-zinc-400 text-sm mb-2 font-medium">APIs & Database Architecture</p>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Node.js, PostgreSQL, Supabase, Firebase. Real-time sync.
                            </p>
                        </div>
                        {mounted && (
                            <div className="h-36 relative border-t border-zinc-800/30 bg-zinc-950/50 flex items-center justify-center">
                                <BackendAnimation />
                            </div>
                        )}
                    </motion.div>

                    {/* Card 4: Realtime */}
                    <motion.div
                        className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800/50 overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="p-6 pb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Realtime</h3>
                            </div>
                            <p className="text-zinc-400 text-sm mb-2 font-medium">Live data synchronization</p>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                WebSockets, subscriptions, instant updates.
                            </p>
                        </div>
                        {mounted && (
                            <div className="h-36 relative border-t border-zinc-800/30 bg-zinc-950/50">
                                <RealtimeAnimation />
                            </div>
                        )}
                    </motion.div>

                    {/* Card 5: AI Solutions */}
                    <motion.div
                        className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800/50 overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <div className="p-6 pb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" />
                                        <circle cx="12" cy="12" r="4" />
                                        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">AI Solutions</h3>
                            </div>
                            <p className="text-zinc-400 text-sm mb-2 font-medium">Intelligent Automation</p>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Neural networks, LLM integration, predictive analytics.
                            </p>
                        </div>
                        {mounted && (
                            <div className="h-36 relative border-t border-zinc-800/30 bg-zinc-950/50 flex items-center justify-center">
                                <AIAnimation />
                            </div>
                        )}
                    </motion.div>

                    {/* Card 6: Cloud Infrastructure - Full Width */}
                    <motion.div
                        className="lg:col-span-3 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800/50 overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <div className="p-6 pb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Cloud Infrastructure</h3>
                            </div>
                            <p className="text-zinc-400 text-sm mb-2 font-medium">Deploy anywhere, scale infinitely</p>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                Vercel, AWS, Docker. Zero-downtime deployments, edge computing, auto-scaling.
                            </p>
                            <div className="flex gap-4 items-center">
                                <span className="text-xs text-zinc-400 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-white/40 rounded-full animate-pulse" />
                                    99.99% Uptime
                                </span>
                                <span className="text-xs text-zinc-500">|</span>
                                <span className="text-xs text-zinc-400">Global Edge Network</span>
                            </div>
                        </div>
                        {mounted && (
                            <div className="h-40 relative border-t border-zinc-800/30 bg-zinc-950/50">
                                <CloudAnimation />
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

// Ultra Premium Web Dev Animation - Interactive Code IDE
function WebDevAnimation() {
    return (
        <div className="absolute inset-4 flex gap-3">
            {/* Left sidebar - File tree */}
            <div className="w-24 bg-zinc-900/60 rounded-lg border border-zinc-700/30 p-2 flex flex-col gap-1">
                {['src', 'components', 'pages', 'api'].map((item, i) => (
                    <motion.div
                        key={item}
                        className="flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[8px] font-mono"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            backgroundColor: i === 1 ? "rgba(255,255,255,0.05)" : "transparent"
                        }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <span className="text-zinc-400">{i < 2 ? '▼' : '▶'}</span>
                        <span className="text-zinc-400">{item}</span>
                    </motion.div>
                ))}
            </div>

            {/* Main editor */}
            <div className="flex-1 bg-zinc-900/60 rounded-lg border border-zinc-700/30 overflow-hidden">
                {/* Tabs */}
                <div className="h-5 bg-zinc-800/50 flex items-center px-2 border-b border-zinc-700/30">
                    <div className="px-2 py-0.5 bg-zinc-900 rounded-t text-[8px] font-mono text-zinc-300 border-t border-x border-zinc-600/30">
                        index.tsx
                    </div>
                </div>
                {/* Code */}
                <div className="p-2 font-mono text-[8px] leading-relaxed">
                    {[
                        { text: "export default function", color: "text-zinc-400" },
                        { text: "  App() {", color: "text-zinc-300" },
                        { text: "    return (", color: "text-zinc-500" },
                        { text: "      <Layout>", color: "text-zinc-300" },
                    ].map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + i * 0.15 }}
                            className={line.color}
                        >
                            {line.text}
                            {i === 3 && (
                                <motion.span
                                    className="inline-block w-1 h-2.5 bg-white/60 ml-0.5"
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Right panel - Live preview */}
            <div className="w-28 bg-zinc-900/60 rounded-lg border border-zinc-700/30 p-2">
                <div className="text-[7px] font-mono text-zinc-500 mb-1">PREVIEW</div>
                <div className="h-full bg-zinc-950 rounded border border-zinc-800/50 p-1.5">
                    <motion.div
                        className="h-2 bg-gradient-to-r from-white/20 to-white/10 rounded mb-1"
                        animate={{ width: ["40%", "80%", "40%"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="flex gap-1">
                        <motion.div
                            className="w-4 h-4 bg-white/10 rounded"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <div className="flex-1 space-y-0.5">
                            <div className="h-1 bg-zinc-700/50 rounded w-full" />
                            <div className="h-1 bg-zinc-700/30 rounded w-3/4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Premium Mobile Animation - App Interface
function MobileAnimation() {
    return (
        <div className="relative">
            {/* Phone frame */}
            <motion.div
                className="w-20 h-36 bg-zinc-950 rounded-2xl border-2 border-zinc-700/50 overflow-hidden relative"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-black rounded-b-xl z-10" />

                {/* Screen content */}
                <div className="pt-4 px-1.5 pb-2 h-full flex flex-col">
                    {/* Header */}
                    <motion.div
                        className="h-3 bg-gradient-to-r from-white/20 to-white/10 rounded-full mb-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Cards */}
                    {[0, 1].map(i => (
                        <motion.div
                            key={i}
                            className="mb-1.5 p-1.5 bg-zinc-800/50 rounded-lg border border-zinc-700/30"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.2 }}
                        >
                            <motion.div
                                className="h-1.5 bg-white/20 rounded mb-1"
                                animate={{ width: ["50%", "80%", "50%"] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            />
                            <div className="h-1 bg-zinc-600/30 rounded w-2/3" />
                        </motion.div>
                    ))}

                    {/* Bottom nav */}
                    <div className="mt-auto flex justify-around">
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                className={`w-2.5 h-2.5 rounded-full ${i === 1 ? 'bg-white/50' : 'bg-zinc-600/50'}`}
                                animate={i === 1 ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Floating notification */}
            <motion.div
                className="absolute -top-2 -right-8 bg-zinc-800 border border-zinc-600/30 rounded-lg px-2 py-1 shadow-lg"
                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], x: [10, 0, 0, 10] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
            >
                <div className="text-[7px] text-zinc-400 font-mono">New update!</div>
            </motion.div>
        </div>
    );
}

// Premium Backend Animation - Server Architecture Flow
function BackendAnimation() {
    const logs = [
        { method: "GET", route: "/api/users", status: "200", time: "12ms" },
        { method: "POST", route: "/api/orders", status: "201", time: "34ms" },
        { method: "GET", route: "/api/products", status: "200", time: "8ms" },
        { method: "PUT", route: "/api/settings", status: "200", time: "21ms" },
    ];

    return (
        <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full h-full flex gap-3">
                {/* Server rack visualization */}
                <div className="w-16 flex flex-col gap-1.5 justify-center">
                    {[
                        { label: "DB", load: 0.62 },
                        { label: "API", load: 0.84 },
                        { label: "CDN", load: 0.41 },
                    ].map((server, i) => (
                        <motion.div
                            key={i}
                            className="bg-zinc-800/50 rounded-md border border-zinc-700/30 p-1.5"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.15 }}
                        >
                            <div className="flex items-center gap-1 mb-1">
                                <motion.div
                                    className="w-1.5 h-1.5 rounded-full bg-emerald-500/70"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                />
                                <span className="text-[7px] text-zinc-400 font-mono">{server.label}</span>
                            </div>
                            <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white/30 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${server.load * 100}%` }}
                                    transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Live request log */}
                <div className="flex-1 bg-zinc-900/40 rounded-lg border border-zinc-700/30 overflow-hidden">
                    <div className="h-4 bg-zinc-800/50 flex items-center px-2 border-b border-zinc-700/20">
                        <div className="text-[7px] font-mono text-zinc-500">REQUEST LOG</div>
                        <motion.div
                            className="ml-auto w-1 h-1 bg-emerald-500/80 rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    </div>
                    <div className="p-1.5 space-y-1">
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                className="flex items-center gap-1.5 font-mono text-[7px]"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.4, duration: 0.3 }}
                            >
                                <span className={`font-bold ${log.method === "POST" ? "text-amber-400/70" : log.method === "PUT" ? "text-blue-400/70" : "text-emerald-400/70"}`}>
                                    {log.method}
                                </span>
                                <span className="text-zinc-500 truncate flex-1">{log.route}</span>
                                <span className="text-emerald-400/60">{log.status}</span>
                                <span className="text-zinc-600">{log.time}</span>
                            </motion.div>
                        ))}
                        <motion.div
                            className="flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.2 }}
                        >
                            <motion.span
                                className="text-[7px] text-zinc-500 font-mono"
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                awaiting...
                            </motion.span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Premium Realtime Animation - WebSocket Event Stream
function RealtimeAnimation() {
    const events = [
        { type: "connect", user: "user_291", time: "0.2s" },
        { type: "message", user: "user_847", time: "0.1s" },
        { type: "update", user: "user_103", time: "0.3s" },
        { type: "sync", user: "broadcast", time: "0.0s" },
    ];

    return (
        <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full h-full flex flex-col gap-2">
                {/* Connection status bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <motion.div
                            className="w-2 h-2 bg-emerald-500/80 rounded-full"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                        />
                        <span className="text-[8px] text-zinc-400 font-mono">ws://live</span>
                    </div>
                    <div className="flex gap-1 items-end h-4">
                        {[0, 1, 2, 3, 4].map(i => (
                            <motion.div
                                key={i}
                                className="w-1 bg-white/30 rounded-full"
                                animate={{ height: [3, 8 + Math.random() * 8, 3] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
                                style={{ height: 3 }}
                            />
                        ))}
                    </div>
                </div>

                {/* Event stream */}
                <div className="flex-1 bg-zinc-900/40 rounded-lg border border-zinc-700/30 overflow-hidden">
                    <div className="h-4 bg-zinc-800/40 flex items-center px-2 border-b border-zinc-700/20">
                        <div className="text-[7px] font-mono text-zinc-500">EVENT STREAM</div>
                        <motion.span
                            className="ml-auto text-[7px] font-mono text-zinc-600"
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            142 events/s
                        </motion.span>
                    </div>
                    <div className="p-1.5 space-y-1">
                        {events.map((event, i) => (
                            <motion.div
                                key={i}
                                className="flex items-center gap-1.5 font-mono text-[7px]"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.5 }}
                            >
                                <motion.div
                                    className={`w-1 h-1 rounded-full ${event.type === "connect" ? "bg-emerald-400" : event.type === "sync" ? "bg-amber-400" : "bg-blue-400"}`}
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                />
                                <span className="text-zinc-500">{event.type}</span>
                                <span className="text-zinc-600 flex-1 truncate">{event.user}</span>
                                <span className="text-zinc-600">{event.time}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Activity sparkline */}
                <div className="flex items-end gap-px h-4">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="flex-1 bg-white/20 rounded-t-sm"
                            animate={{ height: [`${20 + Math.random() * 30}%`, `${50 + Math.random() * 50}%`, `${20 + Math.random() * 30}%`] }}
                            transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: i * 0.05 }}
                            style={{ height: "30%" }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Premium Cloud Animation - Deployment Pipeline
function CloudAnimation() {
    const regions = [
        { name: "US East", status: "active", latency: "12ms" },
        { name: "EU West", status: "active", latency: "28ms" },
        { name: "AP South", status: "scaling", latency: "45ms" },
    ];

    return (
        <div className="absolute inset-0 p-4 flex flex-col gap-2">
            {/* Deploy pipeline */}
            <div className="flex items-center gap-1.5">
                {["Build", "Test", "Stage", "Deploy"].map((step, i) => (
                    <motion.div
                        key={step}
                        className="flex items-center gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.3 }}
                    >
                        <motion.div
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[6px] font-mono border ${i < 3 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400/80" : "bg-zinc-800/50 border-zinc-700/30 text-zinc-500"}`}
                            animate={i === 3 ? { borderColor: ["rgba(63,63,70,0.3)", "rgba(255,255,255,0.3)", "rgba(63,63,70,0.3)"] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            {i < 3 ? "✓" : "⟳"}
                        </motion.div>
                        {i < 3 && (
                            <motion.div
                                className="w-3 h-px bg-emerald-500/30"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: i * 0.3 + 0.2 }}
                            />
                        )}
                    </motion.div>
                ))}
                <motion.span
                    className="ml-auto text-[7px] font-mono text-zinc-500"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    v2.4.1
                </motion.span>
            </div>

            {/* Region cards */}
            <div className="flex-1 flex flex-col gap-1.5 justify-center">
                {regions.map((region, i) => (
                    <motion.div
                        key={i}
                        className="flex items-center gap-2 bg-zinc-900/40 rounded-md border border-zinc-700/20 px-2 py-1.5"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.15 }}
                    >
                        <motion.div
                            className={`w-1.5 h-1.5 rounded-full ${region.status === "active" ? "bg-emerald-500/80" : "bg-amber-400/80"}`}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                        />
                        <span className="text-[7px] font-mono text-zinc-400 flex-1">{region.name}</span>
                        <span className="text-[7px] font-mono text-zinc-600">{region.latency}</span>
                        {/* Mini load bar */}
                        <div className="w-10 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white/25 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: [`${30 + i * 15}%`, `${60 + i * 10}%`, `${30 + i * 15}%`] }}
                                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Traffic distribution */}
            <div className="flex items-end gap-px h-5">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="flex-1 bg-white/15 rounded-t-sm"
                        animate={{ height: ["20%", "50%", "20%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                        style={{ height: "20%" }}
                    />
                ))}
            </div>
        </div>
    );
}

// Premium AI Animation - AI Cortex Visualization
function AIAnimation() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center bg-black">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

            {/* Central Intelligence Core */}
            <div className="relative flex items-center justify-center w-full h-full">

                {/* Outer Rotating Ring - Data Stream */}
                <motion.div
                    className="absolute w-[280px] h-[280px] opacity-20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M50 10 A 40 40 0 0 1 90 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-500" />
                        <path d="M50 90 A 40 40 0 0 1 10 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-500" />
                    </svg>
                </motion.div>

                {/* Middle Rotating Ring - Processing Layer */}
                <motion.div
                    className="absolute w-40 h-40 rounded-full border border-purple-500/20 border-dashed"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Ring - Active Analysis */}
                <motion.div
                    className="absolute w-24 h-24 rounded-full border border-cyan-500/30"
                    animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                    transition={{
                        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                </motion.div>

                {/* Core Nucleus */}
                <motion.div
                    className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 blur-sm opacity-80"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute w-8 h-8 rounded-full bg-white/90 shadow-[0_0_20px_rgba(168,85,247,0.8)] z-10" />

                {/* Scanning Radar Effect */}
                <motion.div
                    className="absolute w-64 h-64 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(168,85,247,0.1)_60deg,transparent_100deg)] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                {/* Floating Data Particles */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-[8px] font-mono text-purple-300/60"
                        initial={{ opacity: 0, x: 0, y: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            x: (Math.random() - 0.5) * 150,
                            y: (Math.random() - 0.5) * 150,
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            repeatDelay: Math.random()
                        }}
                    >
                        {Math.random() > 0.5 ? '1' : '0'}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
