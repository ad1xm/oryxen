"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

// ─── Config ─────────────────────────────────────────────────────
const PARTICLE_COUNT = 70;
const CONNECTION_DIST = 140;
const MOUSE_RADIUS = 180;
const MOUSE_FORCE = 0.02;
const PARTICLE_SPEED = 0.3;
const PULSE_INTERVAL = 180; // frames between pulses

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseSize: number;
    size: number;
    alpha: number;
    pulsePhase: number;
}

interface Pulse {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    life: number;
}

export default function NeuralMesh() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

    const particlesRef = useRef<Particle[]>([]);
    const pulsesRef = useRef<Pulse[]>([]);
    const mouseRef = useRef({ x: -999, y: -999, active: false });
    const animId = useRef(0);
    const frameRef = useRef(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const initParticles = useCallback((w: number, h: number) => {
        const count = w < 768 ? Math.floor(PARTICLE_COUNT * 0.6) : PARTICLE_COUNT;
        particlesRef.current = Array.from({ length: count }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * PARTICLE_SPEED * 2,
            vy: (Math.random() - 0.5) * PARTICLE_SPEED * 2,
            baseSize: Math.random() * 1.8 + 0.6,
            size: 0,
            alpha: Math.random() * 0.4 + 0.15,
            pulsePhase: Math.random() * Math.PI * 2,
        }));
    }, []);

    // ─── Game Loop ────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const el = canvas.parentElement;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            if (particlesRef.current.length === 0) {
                initParticles(canvas.width, canvas.height);
            }
        };
        resize();
        window.addEventListener("resize", resize);

        // Mouse handlers
        const handleMouse = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                active: true,
            };
        };
        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };
        const handleTouch = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                mouseRef.current = {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top,
                    active: true,
                };
            }
        };
        const handleTouchEnd = () => {
            mouseRef.current.active = false;
        };

        canvas.addEventListener("mousemove", handleMouse);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        canvas.addEventListener("touchmove", handleTouch, { passive: true });
        canvas.addEventListener("touchstart", handleTouch, { passive: true });
        canvas.addEventListener("touchend", handleTouchEnd);

        const loop = () => {
            const w = canvas.width;
            const h = canvas.height;
            const particles = particlesRef.current;
            const mouse = mouseRef.current;
            frameRef.current++;
            const t = frameRef.current;

            // ─── Clear ────────────────────────────────
            ctx.fillStyle = "#0a0a0a";
            ctx.fillRect(0, 0, w, h);

            // ─── Spawn periodic pulses ────────────────
            if (t % PULSE_INTERVAL === 0 && particles.length > 0) {
                const src = particles[Math.floor(Math.random() * particles.length)];
                pulsesRef.current.push({
                    x: src.x,
                    y: src.y,
                    radius: 0,
                    maxRadius: 200 + Math.random() * 150,
                    life: 1,
                });
            }

            // ─── Update pulses ────────────────────────
            pulsesRef.current.forEach(p => {
                p.radius += 1.8;
                p.life = Math.max(0, 1 - p.radius / p.maxRadius);
            });
            pulsesRef.current = pulsesRef.current.filter(p => p.life > 0);

            // ─── Update particles ─────────────────────
            particles.forEach(p => {
                // Breathing size
                p.size = p.baseSize * (0.8 + 0.2 * Math.sin(t * 0.015 + p.pulsePhase));

                // Movement
                p.x += p.vx;
                p.y += p.vy;

                // Boundary wrap
                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10;
                if (p.y > h + 10) p.y = -10;

                // Mouse interaction — gentle attraction
                if (mouse.active) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MOUSE_RADIUS && dist > 1) {
                        const force = MOUSE_FORCE * (1 - dist / MOUSE_RADIUS);
                        p.vx += (dx / dist) * force;
                        p.vy += (dy / dist) * force;
                    }
                }

                // Gentle damping
                p.vx *= 0.998;
                p.vy *= 0.998;

                // Speed limit
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > PARTICLE_SPEED * 3) {
                    p.vx = (p.vx / speed) * PARTICLE_SPEED * 3;
                    p.vy = (p.vy / speed) * PARTICLE_SPEED * 3;
                }
            });

            // ─── Draw connections ─────────────────────
            const connDist = w < 768 ? CONNECTION_DIST * 0.75 : CONNECTION_DIST;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connDist) {
                        const alpha = (1 - dist / connDist) * 0.12;

                        // Check if any pulse is passing through this connection
                        let pulseBoost = 0;
                        const midX = (a.x + b.x) / 2;
                        const midY = (a.y + b.y) / 2;
                        pulsesRef.current.forEach(pulse => {
                            const pd = Math.sqrt(
                                (midX - pulse.x) ** 2 + (midY - pulse.y) ** 2
                            );
                            if (Math.abs(pd - pulse.radius) < 30) {
                                pulseBoost = Math.max(pulseBoost, pulse.life * 0.3);
                            }
                        });

                        ctx.strokeStyle = `rgba(255,255,255,${alpha + pulseBoost})`;
                        ctx.lineWidth = 0.5 + pulseBoost * 2;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            // ─── Draw mouse connections ───────────────
            if (mouse.active) {
                particles.forEach(p => {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MOUSE_RADIUS) {
                        const alpha = (1 - dist / MOUSE_RADIUS) * 0.15;
                        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                        ctx.lineWidth = 0.4;
                        ctx.beginPath();
                        ctx.moveTo(mouse.x, mouse.y);
                        ctx.lineTo(p.x, p.y);
                        ctx.stroke();
                    }
                });

                // Mouse glow
                const glow = ctx.createRadialGradient(
                    mouse.x, mouse.y, 0,
                    mouse.x, mouse.y, 60
                );
                glow.addColorStop(0, "rgba(255,255,255,0.04)");
                glow.addColorStop(1, "transparent");
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2);
                ctx.fill();
            }

            // ─── Draw pulse rings ─────────────────────
            pulsesRef.current.forEach(pulse => {
                ctx.strokeStyle = `rgba(255,255,255,${pulse.life * 0.06})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
                ctx.stroke();
            });

            // ─── Draw particles ───────────────────────
            particles.forEach(p => {
                // Check pulse proximity for brightness boost
                let boost = 0;
                pulsesRef.current.forEach(pulse => {
                    const pd = Math.sqrt((p.x - pulse.x) ** 2 + (p.y - pulse.y) ** 2);
                    if (Math.abs(pd - pulse.radius) < 20) {
                        boost = Math.max(boost, pulse.life * 0.5);
                    }
                });

                // Particle glow
                if (p.size > 1 || boost > 0) {
                    const glowSize = (p.size + boost * 4) * 6;
                    const glow = ctx.createRadialGradient(
                        p.x, p.y, 0,
                        p.x, p.y, glowSize
                    );
                    glow.addColorStop(0, `rgba(255,255,255,${(p.alpha * 0.15) + boost * 0.1})`);
                    glow.addColorStop(1, "transparent");
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Particle dot
                ctx.fillStyle = `rgba(255,255,255,${p.alpha + boost})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size + boost * 2, 0, Math.PI * 2);
                ctx.fill();
            });

            // ─── Scanline effect (very subtle) ────────
            const scanY = (t * 0.5) % h;
            const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
            scanGrad.addColorStop(0, "transparent");
            scanGrad.addColorStop(0.5, "rgba(255,255,255,0.008)");
            scanGrad.addColorStop(1, "transparent");
            ctx.fillStyle = scanGrad;
            ctx.fillRect(0, scanY - 30, w, 60);

            // ─── Corner accents ───────────────────────
            const cornerSize = 30;
            ctx.strokeStyle = "rgba(255,255,255,0.08)";
            ctx.lineWidth = 1;

            // Top-left
            ctx.beginPath();
            ctx.moveTo(1, cornerSize);
            ctx.lineTo(1, 1);
            ctx.lineTo(cornerSize, 1);
            ctx.stroke();

            // Top-right
            ctx.beginPath();
            ctx.moveTo(w - cornerSize, 1);
            ctx.lineTo(w - 1, 1);
            ctx.lineTo(w - 1, cornerSize);
            ctx.stroke();

            // Bottom-left
            ctx.beginPath();
            ctx.moveTo(1, h - cornerSize);
            ctx.lineTo(1, h - 1);
            ctx.lineTo(cornerSize, h - 1);
            ctx.stroke();

            // Bottom-right
            ctx.beginPath();
            ctx.moveTo(w - cornerSize, h - 1);
            ctx.lineTo(w - 1, h - 1);
            ctx.lineTo(w - 1, h - cornerSize);
            ctx.stroke();

            animId.current = requestAnimationFrame(loop);
        };

        animId.current = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(animId.current);
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("mousemove", handleMouse);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            canvas.removeEventListener("touchmove", handleTouch);
            canvas.removeEventListener("touchstart", handleTouch);
            canvas.removeEventListener("touchend", handleTouchEnd);
        };
    }, [initParticles]);

    return (
        <section
            ref={sectionRef}
            className="relative py-16 lg:py-24 bg-[#0a0a0a] border-b border-zinc-900 overflow-hidden"
        >
            <div className="container-width mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-3">
                        The Network
                    </h2>
                    <h3 className="text-2xl md:text-3xl text-white font-medium tracking-tight mb-2">
                        Connected Intelligence
                    </h3>
                    <p className="text-zinc-500 text-sm max-w-md">
                        Every node is a decision. Every connection, a possibility. Move your cursor to interact.
                    </p>
                </motion.div>
            </div>

            <motion.div
                className="container-width"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div
                    className="relative rounded-2xl border border-zinc-800/50 overflow-hidden bg-[#0a0a0a]"
                    style={{ height: isMobile ? "360px" : "480px" }}
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full cursor-crosshair outline-none touch-none"
                    />

                    {/* Floating label — bottom-right */}
                    <motion.div
                        className="absolute bottom-4 right-5 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 1.2, duration: 0.8 }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
                            <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
                                Live · Neural Mesh
                            </span>
                        </div>
                    </motion.div>

                    {/* Node count — top-left */}
                    <motion.div
                        className="absolute top-4 left-5 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        <div className="text-[9px] font-mono text-zinc-600 tracking-widest">
                            NODES: {isMobile ? Math.floor(PARTICLE_COUNT * 0.6) : PARTICLE_COUNT}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
