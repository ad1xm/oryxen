"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ─── Simplified world map paths (Natural Earth style) ───────────
// Mercator-projected outlines at viewBox 0 0 1000 500
const CONTINENTS = [
    // North America
    "M130,120 L170,95 L200,85 L230,80 L260,90 L280,110 L290,130 L285,155 L270,170 L250,185 L230,195 L200,210 L185,230 L175,250 L170,240 L160,220 L140,200 L120,185 L110,170 L105,150 L110,135 Z",
    // South America
    "M220,270 L240,260 L260,265 L280,280 L290,310 L295,340 L290,370 L280,395 L265,410 L250,415 L240,405 L230,380 L225,350 L220,320 L215,295 Z",
    // Europe
    "M460,90 L475,85 L500,80 L520,82 L535,90 L540,100 L530,115 L520,125 L505,130 L490,135 L475,130 L465,120 L460,105 Z",
    // Africa
    "M470,155 L490,150 L510,155 L530,165 L540,185 L545,210 L540,240 L530,270 L520,290 L505,305 L490,310 L475,305 L465,290 L458,265 L455,235 L455,210 L460,185 L465,165 Z",
    // Asia
    "M540,60 L580,50 L620,45 L670,50 L720,55 L760,65 L790,80 L800,100 L790,120 L770,135 L740,145 L710,150 L680,148 L650,140 L620,130 L590,120 L560,110 L545,100 L540,85 Z",
    // India subcontinent
    "M630,145 L645,140 L660,145 L670,160 L672,180 L665,200 L655,215 L642,218 L632,210 L625,195 L622,175 L625,158 Z",
    // Australia
    "M760,290 L790,280 L820,285 L840,295 L845,315 L835,335 L815,345 L790,345 L770,335 L760,315 L758,300 Z",
    // Southeast Asia / Indonesia
    "M710,180 L730,175 L750,180 L770,190 L780,200 L775,215 L760,220 L740,218 L720,210 L712,195 Z",
];

// ─── Kolkata origin + destination cities ────────────────────────
const KOLKATA = { x: 648, y: 175, name: "Kolkata" };

const DESTINATIONS = [
    { x: 180, y: 140, name: "New York", delay: 0 },
    { x: 260, y: 305, name: "São Paulo", delay: 0.8 },
    { x: 490, y: 105, name: "London", delay: 1.6 },
    { x: 510, y: 195, name: "Lagos", delay: 2.4 },
    { x: 570, y: 85, name: "Moscow", delay: 3.2 },
    { x: 700, y: 120, name: "Beijing", delay: 0.4 },
    { x: 770, y: 195, name: "Singapore", delay: 1.2 },
    { x: 800, y: 310, name: "Sydney", delay: 2.0 },
    { x: 515, y: 160, name: "Dubai", delay: 2.8 },
    { x: 155, y: 195, name: "Mexico City", delay: 3.6 },
    { x: 470, y: 115, name: "Berlin", delay: 1.0 },
    { x: 740, y: 90, name: "Tokyo", delay: 0.6 },
];

// Generate a curved path from origin to destination
function getCurvedPath(
    ox: number, oy: number,
    dx: number, dy: number
): string {
    const midX = (ox + dx) / 2;
    const midY = (oy + dy) / 2;
    // Arc upward based on distance
    const dist = Math.sqrt((dx - ox) ** 2 + (dy - oy) ** 2);
    const curveHeight = Math.min(dist * 0.3, 80);
    const cpY = midY - curveHeight;
    return `M${ox},${oy} Q${midX},${cpY} ${dx},${dy}`;
}

export default function GlobalReach() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

    return (
        <section
            ref={sectionRef}
            className="py-24 lg:py-32 bg-[#0a0a0a] border-b border-zinc-900 overflow-hidden"
        >
            <div className="container-width">
                {/* Header */}
                <motion.div
                    className="text-center mb-12 lg:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest bg-zinc-800/50 px-3 py-1.5 rounded-sm border border-zinc-700/50 inline-block mb-6">
                        Global Presence
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Delivering Worldwide
                    </h2>
                    <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                        From Kolkata to the world. We ship digital products across continents, time zones, and markets.
                    </p>
                </motion.div>

                {/* World Map */}
                <motion.div
                    className="relative rounded-2xl border border-zinc-800/50 overflow-hidden bg-gradient-to-b from-[#0c0c0c] to-[#080808]"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <svg
                        viewBox="0 0 1000 500"
                        className="w-full h-auto"
                        style={{ maxHeight: "520px" }}
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            {/* Glow filter */}
                            <filter id="nodeGlow">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <filter id="lineGlow">
                                <feGaussianBlur stdDeviation="1.5" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            {/* Gradient for traveling dots */}
                            <radialGradient id="dotGrad">
                                <stop offset="0%" stopColor="white" stopOpacity="1" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </radialGradient>
                        </defs>

                        {/* Grid lines (subtle lat/long) */}
                        {Array.from({ length: 11 }, (_, i) => (
                            <line
                                key={`h${i}`}
                                x1="0" y1={i * 50}
                                x2="1000" y2={i * 50}
                                stroke="rgba(255,255,255,0.015)"
                                strokeWidth="0.5"
                            />
                        ))}
                        {Array.from({ length: 21 }, (_, i) => (
                            <line
                                key={`v${i}`}
                                x1={i * 50} y1="0"
                                x2={i * 50} y2="500"
                                stroke="rgba(255,255,255,0.015)"
                                strokeWidth="0.5"
                            />
                        ))}

                        {/* Continent outlines */}
                        {CONTINENTS.map((d, i) => (
                            <motion.path
                                key={i}
                                d={d}
                                fill="rgba(255,255,255,0.03)"
                                stroke="rgba(255,255,255,0.08)"
                                strokeWidth="1"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                                transition={{ duration: 1.5, delay: 0.3 + i * 0.1 }}
                            />
                        ))}

                        {/* Curved shipping lines from Kolkata */}
                        {DESTINATIONS.map((dest, i) => {
                            const path = getCurvedPath(KOLKATA.x, KOLKATA.y, dest.x, dest.y);
                            const pathId = `route-${i}`;
                            return (
                                <g key={i}>
                                    {/* Static route line (faint) */}
                                    <motion.path
                                        d={path}
                                        fill="none"
                                        stroke="rgba(255,255,255,0.04)"
                                        strokeWidth="1"
                                        initial={{ pathLength: 0 }}
                                        animate={isInView ? { pathLength: 1 } : {}}
                                        transition={{ duration: 1.2, delay: 0.8 + dest.delay * 0.3 }}
                                    />
                                    {/* Animated dashed overlay */}
                                    <motion.path
                                        d={path}
                                        fill="none"
                                        stroke="rgba(255,255,255,0.12)"
                                        strokeWidth="0.8"
                                        strokeDasharray="4 8"
                                        initial={{ strokeDashoffset: 0 }}
                                        animate={isInView ? { strokeDashoffset: -48 } : {}}
                                        transition={{
                                            duration: 3 + Math.random(),
                                            repeat: Infinity,
                                            ease: "linear",
                                            delay: dest.delay * 0.3,
                                        }}
                                    />
                                    {/* Traveling dot along the path */}
                                    <path id={pathId} d={path} fill="none" stroke="none" />
                                    <motion.circle
                                        r="3"
                                        fill="white"
                                        filter="url(#lineGlow)"
                                        initial={{ opacity: 0 }}
                                        animate={isInView ? { opacity: [0, 0.8, 0.8, 0] } : {}}
                                        transition={{
                                            duration: 2.5,
                                            repeat: Infinity,
                                            delay: dest.delay * 0.5,
                                            repeatDelay: 1.5,
                                        }}
                                    >
                                        <animateMotion
                                            dur={`${2.5}s`}
                                            repeatCount="indefinite"
                                            begin={`${dest.delay * 0.5}s`}
                                        >
                                            <mpath href={`#${pathId}`} />
                                        </animateMotion>
                                    </motion.circle>
                                </g>
                            );
                        })}

                        {/* Destination nodes */}
                        {DESTINATIONS.map((dest, i) => (
                            <g key={`dest-${i}`}>
                                {/* Outer pulse ring */}
                                <motion.circle
                                    cx={dest.x} cy={dest.y} r="8"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="0.5"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={isInView ? {
                                        scale: [1, 1.8, 1],
                                        opacity: [0.3, 0, 0.3],
                                    } : {}}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: 1.5 + i * 0.2,
                                    }}
                                />
                                {/* Node dot */}
                                <motion.circle
                                    cx={dest.x} cy={dest.y} r="3"
                                    fill="rgba(255,255,255,0.5)"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
                                />
                                {/* City label */}
                                <motion.text
                                    x={dest.x}
                                    y={dest.y + 16}
                                    textAnchor="middle"
                                    fill="rgba(255,255,255,0.25)"
                                    fontSize="9"
                                    fontFamily="'Inter', system-ui, sans-serif"
                                    fontWeight="400"
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : {}}
                                    transition={{ delay: 1.5 + i * 0.1 }}
                                >
                                    {dest.name}
                                </motion.text>
                            </g>
                        ))}

                        {/* KOLKATA — Origin node (prominent) */}
                        {/* Large pulse */}
                        <motion.circle
                            cx={KOLKATA.x} cy={KOLKATA.y} r="6"
                            fill="none"
                            stroke="rgba(255,255,255,0.15)"
                            strokeWidth="1"
                            animate={isInView ? {
                                r: [6, 20, 6],
                                opacity: [0.4, 0, 0.4],
                            } : {}}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        <motion.circle
                            cx={KOLKATA.x} cy={KOLKATA.y} r="6"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="0.5"
                            animate={isInView ? {
                                r: [6, 30, 6],
                                opacity: [0.3, 0, 0.3],
                            } : {}}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                        />
                        {/* Origin dot */}
                        <motion.circle
                            cx={KOLKATA.x} cy={KOLKATA.y} r="5"
                            fill="white"
                            filter="url(#nodeGlow)"
                            initial={{ scale: 0 }}
                            animate={isInView ? { scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        />
                        {/* Kolkata label */}
                        <motion.text
                            x={KOLKATA.x}
                            y={KOLKATA.y - 16}
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.7)"
                            fontSize="11"
                            fontFamily="'Inter', system-ui, sans-serif"
                            fontWeight="600"
                            letterSpacing="2"
                            initial={{ opacity: 0, y: 5 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.8 }}
                        >
                            KOLKATA
                        </motion.text>
                        <motion.text
                            x={KOLKATA.x}
                            y={KOLKATA.y - 5}
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.3)"
                            fontSize="7"
                            fontFamily="'Inter', system-ui, sans-serif"
                            fontWeight="400"
                            letterSpacing="1"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 1 }}
                        >
                            HQ · ORIGIN
                        </motion.text>
                    </svg>

                    {/* Corner accents */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-l border-t border-zinc-700/30" />
                    <div className="absolute top-3 right-3 w-6 h-6 border-r border-t border-zinc-700/30" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-l border-b border-zinc-700/30" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-zinc-700/30" />

                    {/* Status badge */}
                    <motion.div
                        className="absolute bottom-4 right-5"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 2 }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                            <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
                                Live · {DESTINATIONS.length} Active Routes
                            </span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Stats row */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 1.5 }}
                >
                    {[
                        { value: "12+", label: "Countries Served" },
                        { value: "50+", label: "Projects Shipped" },
                        { value: "24/7", label: "Global Support" },
                        { value: "0ms", label: "Timezone Bottleneck" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="text-center py-5 rounded-xl border border-zinc-800/50 bg-zinc-900/30"
                        >
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-xs text-zinc-500">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
