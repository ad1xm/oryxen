"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { getVisibleShowcaseProjects, ShowcaseProject } from "@/lib/supabase";

// Fallback projects in case database is empty or fails
const fallbackProjects = [
    {
        category: "Web Application",
        title: "Fintech Dashboard",
        description: "Real-time trading analytics with sub-millisecond data visualization.",
        color: "from-zinc-800/50 to-zinc-900/50",
        type: "fintech"
    },
    {
        category: "Mobile App",
        title: "Health Monitor",
        description: "Biometric tracking application integrated with wearable sensors.",
        color: "from-zinc-800/50 to-zinc-900/50",
        type: "health"
    },
    {
        category: "Platform",
        title: "Cloud Automation",
        description: "Autonomous infrastructure scaling for high-traffic enterprise systems.",
        color: "from-zinc-800/50 to-zinc-900/50",
        type: "cloud"
    },
    {
        category: "Internal Tool",
        title: "Logistics Engine",
        description: "Predictive inventory management system with AI forecasting.",
        color: "from-zinc-800/50 to-zinc-900/50",
        type: "logistics"
    }
];

export default function Showcase() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
    const [mounted, setMounted] = useState(false);
    const [projects, setProjects] = useState<Array<{ category: string; title: string; description: string; type: string; color: string }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        async function loadProjects() {
            try {
                const data = await getVisibleShowcaseProjects();
                if (data && data.length > 0) {
                    setProjects(data.map(p => ({
                        ...p,
                        color: "from-zinc-800/50 to-zinc-900/50"
                    })));
                } else {
                    setProjects(fallbackProjects);
                }
            } catch (error) {
                console.error('Failed to load showcase projects:', error);
                setProjects(fallbackProjects);
            } finally {
                setLoading(false);
            }
        }
        loadProjects();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 lg:py-32 bg-black border-b border-zinc-900 overflow-hidden">
            <div className="container-width mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4">Selected Work</h2>
                    <h3 className="text-3xl text-white font-medium tracking-tight">
                        Ship faster. Scale further.
                    </h3>
                </motion.div>
            </div>

            <div
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 md:px-6 lg:px-[calc((100vw-1200px)/2+48px)] pb-12 scrollbar-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        className="flex-none w-[85vw] md:w-[600px] h-[400px] snap-center rounded-2xl bg-zinc-950 border border-zinc-800/50 relative overflow-hidden group cursor-pointer"
                    >
                        <motion.div
                            className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-50`}
                        />

                        {mounted && (
                            <div className="absolute inset-0">
                                {project.type === "fintech" && <FintechAnimation />}
                                {project.type === "health" && <HealthAnimation />}
                                {project.type === "cloud" && <CloudAutomationAnimation />}
                                {project.type === "logistics" && <LogisticsAnimation />}
                            </div>
                        )}

                        <motion.div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                            style={{
                                background: 'linear-gradient(135deg, transparent, rgba(255,255,255,0.02), transparent)',
                            }}
                        />

                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent">
                            <motion.span
                                className="text-[10px] font-medium text-zinc-500 mb-2 block uppercase tracking-[0.2em]"
                                initial={{ opacity: 0, x: -10 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: index * 0.1 + 0.2 }}
                            >
                                {project.category}
                            </motion.span>
                            <motion.h4
                                className="text-2xl font-semibold text-white mb-2 tracking-tight"
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                {project.title}
                            </motion.h4>
                            <motion.p
                                className="text-zinc-500 max-w-sm text-sm"
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: index * 0.1 + 0.4 }}
                            >
                                {project.description}
                            </motion.p>
                        </div>

                        <motion.div className="absolute top-6 right-6">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-sm border border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <span className="text-white/60 text-sm">→</span>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
                <div className="flex-none w-6 lg:w-[calc((100vw-1200px)/2)]" />
            </div>
        </section>
    );
}

// Apple-style Fintech - Clean Trading Interface
function FintechAnimation() {
    // Realistic price data simulation
    const priceData = [
        45, 48, 46, 52, 49, 55, 53, 58, 54, 60,
        57, 62, 59, 56, 61, 58, 64, 60, 66, 63,
        68, 65, 62, 67, 70, 68, 72, 69, 74, 71
    ];

    return (
        <div className="absolute inset-0 p-8 flex flex-col">
            {/* Minimal header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">PORTFOLIO VALUE</div>
                    <motion.div
                        className="text-2xl font-light text-white tracking-tight"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        $127,849.32
                    </motion.div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">24H CHANGE</div>
                    <div className="text-sm text-emerald-500/80 font-medium">+2.41%</div>
                </div>
            </div>

            {/* Elegant line chart */}
            <div className="flex-1 relative">
                <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                    </defs>

                    {/* Subtle grid */}
                    {[25, 50, 75, 100, 125].map((y) => (
                        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    ))}

                    {/* Area fill */}
                    <motion.path
                        d={`M 0,150 ${priceData.map((p, i) => `L ${(i / (priceData.length - 1)) * 400},${150 - p * 1.8}`).join(' ')} L 400,150 Z`}
                        fill="url(#chartGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                    />

                    {/* Main line */}
                    <motion.path
                        d={`M ${priceData.map((p, i) => `${(i / (priceData.length - 1)) * 400},${150 - p * 1.8}`).join(' L ')}`}
                        fill="none"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    />

                    {/* Current price dot */}
                    <motion.circle
                        cx="400"
                        cy={150 - priceData[priceData.length - 1] * 1.8}
                        r="4"
                        fill="white"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2, duration: 0.3 }}
                    />
                    <motion.circle
                        cx="400"
                        cy={150 - priceData[priceData.length - 1] * 1.8}
                        r="8"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
                        transition={{ delay: 2, duration: 2, repeat: Infinity }}
                    />
                </svg>
            </div>

            {/* Minimal metrics */}
            <div className="flex gap-8 mt-4 pt-4 border-t border-zinc-800/50">
                {[
                    { label: "BTC", value: "42,584.21", change: "+1.2%" },
                    { label: "ETH", value: "2,847.90", change: "+0.8%" },
                    { label: "SOL", value: "98.42", change: "-0.3%" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                    >
                        <div className="text-[9px] text-zinc-600 tracking-widest">{item.label}</div>
                        <div className="text-xs text-zinc-300 font-light">${item.value}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Apple-style Health - Minimal Biometrics
function HealthAnimation() {
    return (
        <div className="absolute inset-0 p-8 flex flex-col">
            {/* Clean header */}
            <div className="flex items-center gap-6 mb-8">
                <div>
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">HEART RATE</div>
                    <div className="flex items-baseline gap-2">
                        <motion.span
                            className="text-4xl font-light text-white"
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        >
                            72
                        </motion.span>
                        <span className="text-sm text-zinc-600">BPM</span>
                    </div>
                </div>
            </div>

            {/* Elegant ECG */}
            <div className="flex-1 relative overflow-hidden">
                <svg className="w-full h-24" viewBox="0 0 600 80" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="ecgLine" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                            <stop offset="30%" stopColor="rgba(255,255,255,0.3)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
                        </linearGradient>
                    </defs>

                    <motion.path
                        d="M0,40 L60,40 L70,40 L80,35 L90,45 L100,10 L110,70 L120,40 L180,40 L190,40 L200,35 L210,45 L220,10 L230,70 L240,40 L300,40 L310,40 L320,35 L330,45 L340,10 L350,70 L360,40 L420,40 L430,40 L440,35 L450,45 L460,10 L470,70 L480,40 L540,40 L550,40 L560,35 L570,45 L580,10 L590,70 L600,40"
                        fill="none"
                        stroke="url(#ecgLine)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        animate={{
                            strokeDashoffset: [600, 0],
                        }}
                        style={{ strokeDasharray: "600" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                </svg>
            </div>

            {/* Activity rings - Apple Watch style */}
            <div className="absolute top-8 right-8 w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background rings */}
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                    <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                    <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />

                    {/* Progress rings */}
                    {[
                        { r: 42, progress: 0.78, color: "rgba(255,255,255,0.6)" },
                        { r: 32, progress: 0.62, color: "rgba(255,255,255,0.4)" },
                        { r: 22, progress: 0.91, color: "rgba(255,255,255,0.3)" },
                    ].map((ring, i) => (
                        <motion.circle
                            key={i}
                            cx="50" cy="50" r={ring.r}
                            fill="none"
                            stroke={ring.color}
                            strokeWidth="5"
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                            initial={{ strokeDasharray: `0 ${2 * Math.PI * ring.r}` }}
                            animate={{ strokeDasharray: `${ring.progress * 2 * Math.PI * ring.r} ${2 * Math.PI * ring.r}` }}
                            transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                        />
                    ))}
                </svg>
            </div>

            {/* Minimal stats */}
            <div className="grid grid-cols-4 gap-4 mt-auto pt-6 border-t border-zinc-800/50">
                {[
                    { value: "98%", label: "O₂" },
                    { value: "7.2h", label: "Sleep" },
                    { value: "2.1k", label: "Cal" },
                    { value: "8.4k", label: "Steps" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        className="text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                    >
                        <div className="text-lg font-light text-white">{stat.value}</div>
                        <div className="text-[9px] text-zinc-600 tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Apple-style Cloud - Dynamic Infrastructure
function CloudAutomationAnimation() {
    return (
        <div className="absolute inset-0 p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">INFRASTRUCTURE</div>
                    <div className="text-xl font-light text-white">All Systems Operational</div>
                </div>
                <motion.div
                    className="w-2 h-2 bg-emerald-500/60 rounded-full"
                    animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </div>

            {/* Central hub with orbiting nodes */}
            <div className="flex-1 relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 300 180">
                    {/* Orbit rings */}
                    <ellipse cx="150" cy="90" rx="120" ry="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <ellipse cx="150" cy="90" rx="80" ry="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <ellipse cx="150" cy="90" rx="40" ry="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                    {/* Central hub */}
                    <motion.circle
                        cx="150" cy="90" r="20"
                        fill="rgba(255,255,255,0.05)"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1"
                        animate={{ r: [20, 22, 20] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <circle cx="150" cy="90" r="8" fill="rgba(255,255,255,0.15)" />

                    {/* Orbiting satellites - outer ring */}
                    {[0, 90, 180, 270].map((angle, i) => (
                        <motion.g
                            key={`outer-${i}`}
                            animate={{ rotate: [angle, angle + 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            style={{ transformOrigin: "150px 90px" }}
                        >
                            <circle cx="270" cy="90" r="6" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                            <motion.circle
                                cx="270" cy="90" r="2"
                                fill="white"
                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                            />
                        </motion.g>
                    ))}

                    {/* Orbiting satellites - middle ring */}
                    {[45, 135, 225, 315].map((angle, i) => (
                        <motion.g
                            key={`mid-${i}`}
                            animate={{ rotate: [angle, angle - 360] }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            style={{ transformOrigin: "150px 90px" }}
                        >
                            <circle cx="230" cy="90" r="5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                            <motion.circle
                                cx="230" cy="90" r="1.5"
                                fill="white"
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                            />
                        </motion.g>
                    ))}

                    {/* Data packets traveling to center */}
                    {[0, 120, 240].map((angle, i) => (
                        <motion.circle
                            key={`packet-${i}`}
                            r="3"
                            fill="white"
                            animate={{
                                cx: [150 + 100 * Math.cos(angle * Math.PI / 180), 150],
                                cy: [90 + 50 * Math.sin(angle * Math.PI / 180), 90],
                                opacity: [0, 1, 0],
                                scale: [0.5, 1, 0.5],
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
                        />
                    ))}

                    {/* Connection lines pulse */}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                        <motion.line
                            key={`line-${i}`}
                            x1="150" y1="90"
                            x2={150 + 100 * Math.cos(angle * Math.PI / 180)}
                            y2={90 + 50 * Math.sin(angle * Math.PI / 180)}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="0.5"
                            animate={{ opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        />
                    ))}
                </svg>
            </div>

            {/* Clean metrics */}
            <div className="flex gap-10 pt-4 border-t border-zinc-800/50">
                {[
                    { value: "24", label: "Instances" },
                    { value: "99.9%", label: "Uptime" },
                    { value: "12ms", label: "Latency" },
                ].map((metric, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                    >
                        <div className="text-lg font-light text-white">{metric.value}</div>
                        <div className="text-[9px] text-zinc-600 tracking-widest">{metric.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Apple-style Logistics - Dynamic Supply Chain
function LogisticsAnimation() {
    return (
        <div className="absolute inset-0 p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">SUPPLY CHAIN</div>
                    <div className="text-xl font-light text-white">847 Active Shipments</div>
                </div>
                <div className="flex items-center gap-2">
                    <motion.div
                        className="w-1.5 h-1.5 bg-white/60 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-[9px] text-zinc-500">LIVE</span>
                </div>
            </div>

            {/* Globe visualization */}
            <div className="flex-1 relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 300 160">
                    {/* Globe circle */}
                    <circle cx="150" cy="80" r="65" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <ellipse cx="150" cy="80" rx="65" ry="25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <ellipse cx="150" cy="80" rx="65" ry="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" transform="rotate(60 150 80)" />
                    <ellipse cx="150" cy="80" rx="65" ry="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" transform="rotate(-60 150 80)" />

                    {/* Warehouse nodes */}
                    {[
                        { x: 60, y: 60, label: "NYC" },
                        { x: 110, y: 100, label: "LA" },
                        { x: 180, y: 50, label: "LON" },
                        { x: 230, y: 90, label: "TKY" },
                        { x: 150, y: 130, label: "SYD" },
                    ].map((node, i) => (
                        <g key={i}>
                            {/* Node glow */}
                            <motion.circle
                                cx={node.x} cy={node.y} r="12"
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="1"
                                animate={{ r: [12, 16, 12], opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            />
                            {/* Node */}
                            <motion.circle
                                cx={node.x} cy={node.y} r="6"
                                fill="rgba(255,255,255,0.1)"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.1, duration: 0.3 }}
                            />
                            <motion.circle
                                cx={node.x} cy={node.y} r="2"
                                fill="white"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            />
                            {/* Label */}
                            <text
                                x={node.x} y={node.y + 20}
                                textAnchor="middle"
                                className="text-[8px] fill-zinc-500 font-light tracking-wider"
                            >
                                {node.label}
                            </text>
                        </g>
                    ))}

                    {/* Route arcs */}
                    <motion.path
                        d="M 60,60 Q 85,30 110,100"
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        animate={{ strokeDashoffset: [0, -14] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.path
                        d="M 110,100 Q 145,60 180,50"
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        animate={{ strokeDashoffset: [0, -14] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.2 }}
                    />
                    <motion.path
                        d="M 180,50 Q 205,70 230,90"
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        animate={{ strokeDashoffset: [0, -14] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.4 }}
                    />
                    <motion.path
                        d="M 230,90 Q 190,120 150,130"
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        animate={{ strokeDashoffset: [0, -14] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.6 }}
                    />

                    {/* Moving packages */}
                    <motion.circle
                        r="4"
                        fill="white"
                        animate={{
                            cx: [60, 110, 180, 230, 150, 60],
                            cy: [60, 100, 50, 90, 130, 60],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.circle
                        r="3"
                        fill="rgba(255,255,255,0.6)"
                        animate={{
                            cx: [180, 230, 150, 60, 110, 180],
                            cy: [50, 90, 130, 60, 100, 50],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                </svg>
            </div>

            {/* Progress bars */}
            <div className="flex gap-4 mb-4">
                {[
                    { label: "Processing", progress: 0.85 },
                    { label: "In Transit", progress: 0.62 },
                    { label: "Delivered", progress: 0.94 },
                ].map((item, i) => (
                    <div key={i} className="flex-1">
                        <div className="flex justify-between text-[8px] mb-1">
                            <span className="text-zinc-500">{item.label}</span>
                            <span className="text-zinc-400">{Math.round(item.progress * 100)}%</span>
                        </div>
                        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white/40 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress * 100}%` }}
                                transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Minimal stats */}
            <div className="flex gap-8 pt-4 border-t border-zinc-800/50">
                {[
                    { value: "2.3d", label: "Avg Transit" },
                    { value: "12.4K", label: "Delivered" },
                    { value: "98.2%", label: "On Time" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                    >
                        <div className="text-lg font-light text-white">{stat.value}</div>
                        <div className="text-[9px] text-zinc-600 tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

