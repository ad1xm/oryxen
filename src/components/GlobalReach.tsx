"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";

const W = 1000, H = 500;
const toX = (lon: number) => ((lon + 180) / 360) * W;
const toY = (lat: number) => ((90 - lat) / 180) * H;

// Point-in-polygon (ray casting)
function pip(px: number, py: number, poly: number[][]): boolean {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i], [xj, yj] = poly[j];
        if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)
            inside = !inside;
    }
    return inside;
}

// Land polygons [lon, lat][] — simplified but realistic outlines
const LAND: number[][][] = [
    // North America mainland
    [[-130, 55], [-125, 50], [-124, 45], [-120, 38], [-118, 34], [-113, 30], [-110, 24], [-105, 20], [-100, 16], [-95, 16], [-90, 15], [-87, 16], [-85, 18], [-83, 20], [-82, 25], [-81, 28], [-80, 30], [-78, 33], [-76, 36], [-74, 40], [-71, 42], [-68, 44], [-66, 44], [-64, 47], [-60, 47], [-56, 50], [-55, 53], [-58, 55], [-62, 54], [-65, 48], [-67, 47], [-70, 44], [-73, 45], [-78, 43], [-82, 43], [-85, 44], [-88, 46], [-92, 48], [-95, 49], [-100, 49], [-108, 49], [-115, 49], [-120, 49], [-125, 50], [-130, 55]],
    // Alaska
    [[-168, 65], [-160, 70], [-152, 71], [-145, 68], [-140, 62], [-135, 58], [-131, 55], [-135, 56], [-142, 58], [-150, 59], [-158, 57], [-163, 58], [-168, 65]],
    // Northern Canada / Arctic
    [[-130, 55], [-125, 58], [-120, 60], [-110, 62], [-100, 63], [-95, 60], [-90, 58], [-85, 60], [-80, 62], [-75, 58], [-68, 60], [-62, 62], [-58, 65], [-62, 67], [-70, 68], [-80, 70], [-90, 70], [-100, 72], [-110, 70], [-120, 68], [-130, 66], [-138, 69], [-145, 72], [-140, 74], [-130, 72], [-120, 74], [-110, 75], [-100, 77], [-90, 73], [-80, 75], [-75, 68], [-68, 63], [-60, 58], [-55, 55], [-58, 55], [-60, 54], [-64, 48], [-68, 47], [-72, 46], [-76, 48], [-80, 50], [-85, 52], [-90, 52], [-95, 52], [-100, 52], [-110, 52], [-120, 52], [-125, 53], [-130, 55]],
    // Greenland
    [[-55, 60], [-46, 60], [-38, 63], [-28, 68], [-22, 72], [-18, 76], [-20, 81], [-30, 83], [-42, 83], [-52, 82], [-56, 78], [-58, 73], [-55, 65], [-55, 60]],
    // South America
    [[-80, 8], [-77, 7], [-74, 11], [-70, 12], [-65, 11], [-60, 8], [-55, 4], [-51, 1], [-48, -3], [-44, -2], [-38, -4], [-35, -7], [-37, -12], [-39, -16], [-41, -21], [-44, -23], [-47, -26], [-50, -30], [-53, -33], [-56, -36], [-60, -39], [-64, -42], [-67, -46], [-66, -52], [-69, -55], [-74, -52], [-74, -46], [-73, -40], [-72, -34], [-71, -28], [-70, -18], [-75, -13], [-77, -6], [-80, -2], [-79, 3], [-77, 6], [-80, 8]],
    // Europe mainland
    [[-10, 36], [-8, 40], [-9, 43], [-5, 44], [-2, 47], [1, 48], [3, 47], [5, 44], [7, 44], [9, 46], [12, 47], [15, 46], [14, 42], [12, 38], [15, 38], [18, 40], [20, 37], [25, 35], [26, 38], [28, 41], [24, 42], [20, 43], [18, 47], [16, 48], [14, 50], [14, 54], [10, 55], [8, 55], [6, 51], [3, 50], [1, 51], [-2, 49], [-4, 44], [-8, 37], [-10, 36]],
    // Scandinavia
    [[5, 58], [8, 57], [12, 58], [16, 59], [20, 62], [24, 65], [20, 68], [16, 70], [12, 70], [8, 63], [5, 58]],
    // UK
    [[-6, 50], [-3, 50], [0, 51], [1, 53], [0, 56], [-2, 57], [-4, 58], [-5, 55], [-5, 52], [-6, 50]],
    // Ireland
    [[-10, 52], [-8, 51], [-6, 52], [-6, 54], [-8, 55], [-10, 54], [-10, 52]],
    // Iceland
    [[-24, 64], [-20, 63], [-14, 65], [-14, 66], [-20, 66], [-24, 65], [-24, 64]],
    // Africa
    [[-17, 15], [-16, 12], [-15, 10], [-10, 6], [-5, 5], [0, 5], [3, 6], [8, 4], [10, 2], [10, -1], [12, -5], [14, -10], [16, -16], [20, -25], [25, -30], [28, -33], [30, -34], [33, -28], [35, -22], [38, -12], [42, -2], [44, 3], [48, 8], [50, 12], [44, 12], [36, 14], [32, 10], [20, 16], [15, 23], [12, 28], [10, 35], [5, 36], [0, 36], [-5, 36], [-8, 32], [-13, 28], [-17, 22], [-17, 15]],
    // Madagascar
    [[44, -12], [47, -16], [49, -22], [48, -25], [46, -24], [44, -19], [44, -12]],
    // Arabian Peninsula
    [[33, 30], [36, 30], [36, 22], [40, 16], [43, 13], [48, 12], [52, 16], [55, 22], [56, 26], [52, 28], [48, 30], [44, 33], [40, 38], [36, 36], [33, 32], [33, 30]],
    // Iran / Central Asia corridor
    [[44, 38], [48, 38], [52, 36], [55, 35], [58, 38], [62, 38], [66, 38], [70, 37], [74, 35], [76, 36], [74, 39], [70, 42], [65, 42], [60, 42], [56, 40], [52, 40], [48, 40], [44, 38]],
    // Russia / Siberia
    [[28, 55], [30, 52], [36, 50], [42, 48], [48, 50], [55, 52], [60, 55], [65, 55], [70, 58], [80, 55], [85, 50], [90, 48], [95, 50], [100, 52], [105, 55], [110, 55], [115, 52], [120, 50], [128, 50], [132, 48], [135, 52], [140, 52], [148, 55], [155, 58], [160, 60], [163, 62], [168, 66], [172, 65], [178, 65], [180, 65], [180, 72], [172, 72], [165, 70], [155, 62], [148, 58], [140, 55], [135, 58], [130, 62], [122, 65], [115, 68], [108, 70], [100, 68], [90, 66], [80, 68], [70, 68], [60, 67], [50, 68], [42, 68], [35, 66], [28, 62], [28, 55]],
    // India
    [[68, 24], [70, 28], [72, 32], [75, 35], [78, 35], [82, 30], [85, 27], [88, 23], [88, 21], [86, 18], [84, 14], [81, 10], [79, 8], [77, 8], [76, 13], [75, 16], [73, 16], [72, 20], [69, 22], [68, 24]],
    // Sri Lanka
    [[80, 10], [81, 8], [82, 7], [81, 6], [80, 7], [80, 10]],
    // China / East Asia
    [[76, 36], [78, 40], [82, 42], [86, 48], [90, 48], [95, 46], [100, 42], [105, 40], [110, 36], [114, 32], [116, 28], [114, 24], [110, 20], [108, 22], [106, 22], [104, 17], [100, 16], [100, 22], [102, 23], [106, 24], [110, 25], [114, 28], [114, 34], [110, 38], [105, 42], [100, 45], [95, 48], [90, 50], [85, 50], [80, 48], [76, 42], [76, 36]],
    // Korea
    [[125, 38], [127, 36], [129, 34], [130, 35], [128, 38], [126, 39], [125, 38]],
    // Japan
    [[130, 31], [132, 34], [136, 36], [139, 38], [141, 41], [141, 44], [139, 42], [136, 38], [133, 35], [130, 31]],
    [[140, 43], [143, 43], [145, 44], [144, 45], [141, 44], [140, 43]],
    // Southeast Asia mainland
    [[93, 20], [97, 22], [99, 18], [100, 16], [102, 14], [104, 12], [106, 10], [108, 12], [108, 16], [106, 20], [104, 18], [100, 17], [98, 16], [95, 16], [93, 18], [93, 20]],
    // Malay Peninsula
    [[100, 8], [101, 6], [103, 3], [104, 2], [103, 5], [101, 7], [100, 8]],
    // Sumatra
    [[95, 5], [98, 3], [104, -2], [106, -5], [104, -5], [100, -2], [96, 1], [95, 5]],
    // Borneo
    [[108, 5], [112, 3], [116, 2], [118, 5], [116, 7], [112, 6], [109, 3], [108, 5]],
    // Philippines
    [[118, 10], [120, 14], [122, 18], [122, 15], [121, 12], [119, 8], [118, 10]],
    // Australia
    [[115, -14], [122, -14], [130, -12], [136, -12], [140, -15], [145, -16], [149, -20], [153, -25], [153, -30], [150, -35], [148, -39], [145, -39], [140, -38], [135, -35], [128, -33], [120, -34], [115, -34], [114, -28], [114, -22], [115, -18], [115, -14]],
    // Tasmania
    [[145, -40], [148, -41], [148, -43], [146, -44], [145, -42], [145, -40]],
    // New Zealand
    [[173, -36], [176, -38], [178, -41], [177, -43], [175, -41], [173, -38], [173, -36]],
    [[167, -44], [170, -43], [172, -45], [171, -46], [168, -46], [167, -44]],
    // Papua New Guinea
    [[141, -2], [145, -5], [150, -6], [155, -5], [152, -8], [147, -8], [142, -6], [141, -2]],
    // Java
    [[105, -6], [110, -7], [114, -8], [113, -8], [108, -8], [105, -7], [105, -6]],
];

// Destinations with real coordinates
const KOLKATA = { lon: 88.4, lat: 22.6 };
const DESTS = [
    { lon: -74, lat: 40.7, name: "New York" },
    { lon: -46.6, lat: -23.5, name: "São Paulo" },
    { lon: -0.1, lat: 51.5, name: "London" },
    { lon: 3.4, lat: 6.5, name: "Lagos" },
    { lon: 37.6, lat: 55.8, name: "Moscow" },
    { lon: 116.4, lat: 39.9, name: "Beijing" },
    { lon: 103.8, lat: 1.35, name: "Singapore" },
    { lon: 151.2, lat: -33.9, name: "Sydney" },
    { lon: 55.3, lat: 25.3, name: "Dubai" },
    { lon: 13.4, lat: 52.5, name: "Berlin" },
    { lon: 139.7, lat: 35.7, name: "Tokyo" },
    { lon: -99.1, lat: 19.4, name: "Mexico City" },
];

function curvedPath(ox: number, oy: number, dx: number, dy: number): string {
    const mx = (ox + dx) / 2;
    const dist = Math.sqrt((dx - ox) ** 2 + (dy - oy) ** 2);
    const cy = (oy + dy) / 2 - Math.min(dist * 0.3, 90);
    return `M${ox},${oy} Q${mx},${cy} ${dx},${dy}`;
}

export default function GlobalReach() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

    // Generate dot-matrix world map (computed once)
    const dots = useMemo(() => {
        const result: { x: number; y: number }[] = [];
        const step = 4;
        for (let lat = 82; lat >= -78; lat -= step) {
            for (let lon = -176; lon <= 176; lon += step) {
                if (LAND.some(poly => pip(lon, lat, poly))) {
                    result.push({ x: toX(lon), y: toY(lat) });
                }
            }
        }
        return result;
    }, []);

    const kx = toX(KOLKATA.lon), ky = toY(KOLKATA.lat);

    return (
        <section ref={sectionRef} className="py-24 lg:py-32 bg-[#0a0a0a] border-b border-zinc-900 overflow-hidden">
            <div className="container-width">
                <motion.div className="text-center mb-12 lg:mb-16" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
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

                <motion.div className="relative rounded-2xl border border-zinc-800/50 overflow-hidden bg-gradient-to-b from-[#0c0c0c] to-[#080808]" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>
                    <svg viewBox="0 0 1000 500" className="w-full h-auto" style={{ maxHeight: "520px" }} preserveAspectRatio="xMidYMid meet">
                        <defs>
                            <filter id="gR"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                            <filter id="gL"><feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                        </defs>

                        {/* Dot-matrix world map */}
                        {dots.map((d, i) => (
                            <motion.circle key={i} cx={d.x} cy={d.y} r="2" fill="rgba(255,255,255,0.12)" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: 0.2 + (i % 80) * 0.01 }} />
                        ))}

                        {/* Shipping lines from Kolkata */}
                        {DESTS.map((dest, i) => {
                            const dx = toX(dest.lon), dy = toY(dest.lat);
                            const path = curvedPath(kx, ky, dx, dy);
                            const id = `r${i}`;
                            const delay = i * 0.4;
                            return (
                                <g key={i}>
                                    <motion.path d={path} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ duration: 1.2, delay: 1 + delay * 0.3 }} />
                                    <motion.path d={path} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="4 8" animate={isInView ? { strokeDashoffset: [-48, 0] } : {}} transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: delay * 0.3 }} />
                                    <path id={id} d={path} fill="none" stroke="none" />
                                    <motion.circle r="2.5" fill="white" filter="url(#gL)" initial={{ opacity: 0 }} animate={isInView ? { opacity: [0, 0.9, 0.9, 0] } : {}} transition={{ duration: 2.5, repeat: Infinity, delay: delay * 0.5, repeatDelay: 2 }}>
                                        <animateMotion dur="2.5s" repeatCount="indefinite" begin={`${delay * 0.5}s`}><mpath href={`#${id}`} /></animateMotion>
                                    </motion.circle>
                                    {/* Destination dot */}
                                    <motion.circle cx={dx} cy={dy} r="3" fill="rgba(255,255,255,0.5)" initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}} transition={{ delay: 1.2 + i * 0.1 }} />
                                    <motion.circle cx={dx} cy={dy} r="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" animate={isInView ? { scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] } : {}} transition={{ duration: 3, repeat: Infinity, delay: 1.5 + i * 0.2 }} />
                                    <motion.text x={dx} y={dy + 16} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="'Inter', system-ui, sans-serif" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.5 + i * 0.1 }}>{dest.name}</motion.text>
                                </g>
                            );
                        })}

                        {/* Kolkata origin */}
                        <motion.circle cx={kx} cy={ky} r="6" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" animate={isInView ? { r: [6, 22, 6], opacity: [0.4, 0, 0.4] } : {}} transition={{ duration: 2.5, repeat: Infinity }} />
                        <motion.circle cx={kx} cy={ky} r="6" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" animate={isInView ? { r: [6, 32, 6], opacity: [0.3, 0, 0.3] } : {}} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
                        <motion.circle cx={kx} cy={ky} r="5" fill="white" filter="url(#gR)" initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}} transition={{ delay: 0.6 }} />
                        <motion.text x={kx} y={ky - 18} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="'Inter', system-ui, sans-serif" fontWeight="600" letterSpacing="2" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}>KOLKATA</motion.text>
                        <motion.text x={kx} y={ky - 7} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="'Inter', system-ui, sans-serif" letterSpacing="1" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1 }}>HQ · ORIGIN</motion.text>
                    </svg>

                    {/* Corner accents */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-l border-t border-zinc-700/30" />
                    <div className="absolute top-3 right-3 w-6 h-6 border-r border-t border-zinc-700/30" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-l border-b border-zinc-700/30" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-zinc-700/30" />

                    <motion.div className="absolute bottom-4 right-5" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2 }}>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                            <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">Live · {DESTS.length} Active Routes</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
