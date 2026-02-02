"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

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
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <path d="M3 9h18" />
                                        <circle cx="7" cy="6" r="1" fill="currentColor" />
                                        <circle cx="10" cy="6" r="1" fill="currentColor" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Web Development</h3>
                            </div>
                            <p className="text-cyan-400 text-sm mb-2 font-medium">Production-grade web applications</p>
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
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="5" y="2" width="14" height="20" rx="3" />
                                        <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Mobile Apps</h3>
                            </div>
                            <p className="text-purple-400 text-sm mb-2 font-medium">Cross-platform native experiences</p>
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
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <ellipse cx="12" cy="6" rx="8" ry="3" />
                                        <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
                                        <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Backend Systems</h3>
                            </div>
                            <p className="text-green-400 text-sm mb-2 font-medium">APIs & Database Architecture</p>
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
                                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Realtime</h3>
                            </div>
                            <p className="text-yellow-400 text-sm mb-2 font-medium">Live data synchronization</p>
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

                    {/* Card 5: Cloud Infrastructure - Large */}
                    <motion.div
                        className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800/50 overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <div className="p-6 pb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Cloud Infrastructure</h3>
                            </div>
                            <p className="text-blue-400 text-sm mb-2 font-medium">Deploy anywhere, scale infinitely</p>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                Vercel, AWS, Docker. Zero-downtime deployments, edge computing, auto-scaling.
                            </p>
                            <div className="flex gap-4 items-center">
                                <span className="text-xs text-zinc-400 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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
                            backgroundColor: i === 1 ? "rgba(34,211,238,0.1)" : "transparent"
                        }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <span className="text-cyan-400">{i < 2 ? '▼' : '▶'}</span>
                        <span className="text-zinc-400">{item}</span>
                    </motion.div>
                ))}
            </div>

            {/* Main editor */}
            <div className="flex-1 bg-zinc-900/60 rounded-lg border border-zinc-700/30 overflow-hidden">
                {/* Tabs */}
                <div className="h-5 bg-zinc-800/50 flex items-center px-2 border-b border-zinc-700/30">
                    <div className="px-2 py-0.5 bg-zinc-900 rounded-t text-[8px] font-mono text-cyan-400 border-t border-x border-cyan-500/30">
                        index.tsx
                    </div>
                </div>
                {/* Code */}
                <div className="p-2 font-mono text-[8px] leading-relaxed">
                    {[
                        { text: "export default function", color: "text-purple-400" },
                        { text: "  App() {", color: "text-zinc-300" },
                        { text: "    return (", color: "text-zinc-500" },
                        { text: "      <Layout>", color: "text-cyan-400" },
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
                                    className="inline-block w-1 h-2.5 bg-cyan-400 ml-0.5"
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
                        className="h-2 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded mb-1"
                        animate={{ width: ["40%", "80%", "40%"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="flex gap-1">
                        <motion.div
                            className="w-4 h-4 bg-cyan-500/20 rounded"
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
                        className="h-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full mb-2"
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
                                className="h-1.5 bg-purple-500/40 rounded mb-1"
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
                                className={`w-2.5 h-2.5 rounded-full ${i === 1 ? 'bg-purple-500' : 'bg-zinc-600/50'}`}
                                animate={i === 1 ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Floating notification */}
            <motion.div
                className="absolute -top-2 -right-8 bg-zinc-800 border border-purple-500/30 rounded-lg px-2 py-1 shadow-lg"
                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], x: [10, 0, 0, 10] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
            >
                <div className="text-[7px] text-purple-400 font-mono">New update!</div>
            </motion.div>
        </div>
    );
}

// Premium Backend Animation - Data Flow
function BackendAnimation() {
    return (
        <div className="relative w-full h-full">
            <svg className="w-full h-full" viewBox="0 0 200 100">
                <defs>
                    <linearGradient id="dataGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(74,222,128,0.8)" />
                        <stop offset="100%" stopColor="rgba(34,211,238,0.8)" />
                    </linearGradient>
                    <filter id="glow2">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Database cylinders */}
                <g transform="translate(30, 30)">
                    {[0, 1, 2].map(i => (
                        <g key={i} transform={`translate(0, ${i * 15})`}>
                            <motion.ellipse
                                cx="15" cy="5" rx="15" ry="5"
                                fill="none" stroke="rgba(74,222,128,0.4)" strokeWidth="1"
                                animate={{ stroke: ["rgba(74,222,128,0.3)", "rgba(74,222,128,0.7)", "rgba(74,222,128,0.3)"] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            />
                            <motion.rect
                                x="0" y="5" width="30" height="10"
                                fill="rgba(74,222,128,0.1)" stroke="rgba(74,222,128,0.4)" strokeWidth="1"
                            />
                        </g>
                    ))}
                </g>

                {/* API Gateway */}
                <motion.rect
                    x="85" y="35" width="30" height="30" rx="4"
                    fill="rgba(74,222,128,0.1)" stroke="rgba(74,222,128,0.5)" strokeWidth="1"
                    animate={{ stroke: ["rgba(74,222,128,0.4)", "rgba(74,222,128,0.8)", "rgba(74,222,128,0.4)"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <text x="100" y="54" textAnchor="middle" className="text-[8px] fill-green-400 font-mono">API</text>

                {/* Client nodes */}
                {[0, 1, 2].map(i => (
                    <motion.circle
                        key={i}
                        cx={160} cy={25 + i * 25} r="8"
                        fill="rgba(34,211,238,0.1)" stroke="rgba(34,211,238,0.5)" strokeWidth="1"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    />
                ))}

                {/* Data flow lines */}
                <motion.line x1="60" y1="50" x2="85" y2="50" stroke="url(#dataGrad)" strokeWidth="2" strokeDasharray="4 2"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.line x1="115" y1="40" x2="152" y2="25" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" strokeDasharray="4 2"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.2 }}
                />
                <motion.line x1="115" y1="50" x2="152" y2="50" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" strokeDasharray="4 2"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.4 }}
                />
                <motion.line x1="115" y1="60" x2="152" y2="75" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" strokeDasharray="4 2"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.6 }}
                />

                {/* Traveling data packets */}
                <motion.circle r="3" fill="url(#dataGrad)" filter="url(#glow2)"
                    animate={{ cx: [60, 85, 85], cy: [50, 50, 50], opacity: [1, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </svg>
        </div>
    );
}

// Premium Realtime Animation - Signal Waves
function RealtimeAnimation() {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32">
                {/* Central transmitter */}
                <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center"
                    animate={{ rotate: [0, 90, 180, 270, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                    <motion.div
                        className="w-3 h-3 bg-white rounded-sm"
                        animate={{ scale: [1, 0.8, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    />
                </motion.div>

                {/* Wave rings */}
                {[1, 2, 3, 4].map(i => (
                    <motion.div
                        key={i}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-500/40"
                        style={{ width: 24 + i * 24, height: 24 + i * 24 }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.6, 0.2, 0.6],
                            borderColor: ["rgba(234,179,8,0.4)", "rgba(234,179,8,0.1)", "rgba(234,179,8,0.4)"]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeOut" }}
                    />
                ))}

                {/* Data particles */}
                {[0, 72, 144, 216, 288].map((angle, i) => (
                    <motion.div
                        key={i}
                        className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full"
                        style={{
                            transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-48px)`
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                    />
                ))}
            </div>
        </div>
    );
}

// Premium Cloud Animation - Global Network
function CloudAnimation() {
    const cities = [
        { x: 25, y: 40, name: "SF" },
        { x: 45, y: 30, name: "NYC" },
        { x: 55, y: 50, name: "LON" },
        { x: 70, y: 35, name: "TOK" },
        { x: 80, y: 55, name: "SYD" },
    ];

    return (
        <div className="absolute inset-4">
            <svg className="w-full h-full" viewBox="0 0 100 80">
                <defs>
                    <filter id="cloudGlow">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Connection lines */}
                {cities.map((city, i) =>
                    cities.slice(i + 1).map((target, j) => (
                        <motion.line
                            key={`${i}-${j}`}
                            x1={`${city.x}%`} y1={`${city.y}%`}
                            x2={`${target.x}%`} y2={`${target.y}%`}
                            stroke="rgba(96,165,250,0.15)"
                            strokeWidth="0.5"
                            strokeDasharray="2 2"
                            animate={{ strokeDashoffset: [0, -10] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    ))
                )}

                {/* City nodes */}
                {cities.map((city, i) => (
                    <g key={i}>
                        <motion.circle
                            cx={`${city.x}%`} cy={`${city.y}%`}
                            r="6"
                            fill="rgba(96,165,250,0.1)"
                            stroke="rgba(96,165,250,0.5)"
                            strokeWidth="1"
                            filter="url(#cloudGlow)"
                            animate={{
                                r: [6, 8, 6],
                                fill: ["rgba(96,165,250,0.1)", "rgba(96,165,250,0.2)", "rgba(96,165,250,0.1)"]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        />
                        <text
                            x={`${city.x}%`} y={`${city.y + 12}%`}
                            textAnchor="middle"
                            className="text-[6px] fill-blue-400/70 font-mono"
                        >
                            {city.name}
                        </text>
                    </g>
                ))}

                {/* Traveling packets */}
                <motion.circle
                    r="2"
                    fill="#60A5FA"
                    filter="url(#cloudGlow)"
                    animate={{
                        cx: [`${cities[0].x}%`, `${cities[1].x}%`, `${cities[2].x}%`, `${cities[3].x}%`, `${cities[4].x}%`, `${cities[0].x}%`],
                        cy: [`${cities[0].y}%`, `${cities[1].y}%`, `${cities[2].y}%`, `${cities[3].y}%`, `${cities[4].y}%`, `${cities[0].y}%`],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                    r="2"
                    fill="#34D399"
                    filter="url(#cloudGlow)"
                    animate={{
                        cx: [`${cities[4].x}%`, `${cities[3].x}%`, `${cities[2].x}%`, `${cities[1].x}%`, `${cities[0].x}%`, `${cities[4].x}%`],
                        cy: [`${cities[4].y}%`, `${cities[3].y}%`, `${cities[2].y}%`, `${cities[1].y}%`, `${cities[0].y}%`, `${cities[4].y}%`],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 3 }}
                />
            </svg>
        </div>
    );
}
