"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

// ─── Game Config ────────────────────────────────────────────────
const RINGS = [80, 120, 160]; // orbital radii
const PLAYER_ORBIT_SPEED = 0.025; // radians per frame
const OBSTACLE_ARC = 0.9; // radians - arc length of obstacles
const PARTICLE_COUNT = 30;
const STAR_COUNT = 80;

interface Obstacle {
    ring: number;      // which ring (0, 1, 2)
    angle: number;     // start angle in radians
    arc: number;       // arc length
    speed: number;     // rotation speed (rad/frame)
    direction: number; // 1 or -1
}

interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    life: number; size: number;
    alpha: number;
}

interface Star {
    x: number; y: number;
    size: number; alpha: number;
    twinkle: number; phase: number;
}

interface TrailPoint {
    x: number; y: number; alpha: number;
}

export default function MiniGame() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

    const [gameState, setGameState] = useState<"idle" | "playing" | "dead">("idle");
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Refs for the game loop
    const gsRef = useRef(gameState);
    const scoreRef = useRef(0);
    const highRef = useRef(0);
    const playerAngle = useRef(0);
    const playerRing = useRef(1); // start on middle ring
    const playerDirection = useRef(1); // 1=CW, -1=CCW
    const obstacles = useRef<Obstacle[]>([]);
    const particles = useRef<Particle[]>([]);
    const stars = useRef<Star[]>([]);
    const trail = useRef<TrailPoint[]>([]);
    const frame = useRef(0);
    const animId = useRef(0);
    const shakeRef = useRef(0);
    const flashRef = useRef(0);
    const pulseRef = useRef(0);
    const difficultyTimer = useRef(0);
    const speedMultiplier = useRef(1);

    useEffect(() => { gsRef.current = gameState; }, [gameState]);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("oryxen-orbit-highscore");
        if (saved) { highRef.current = parseInt(saved); setHighScore(parseInt(saved)); }
    }, []);

    // Init stars
    const initStars = useCallback((w: number, h: number) => {
        stars.current = Array.from({ length: STAR_COUNT }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.3 + 0.05,
            twinkle: Math.random() * 0.015 + 0.005,
            phase: Math.random() * Math.PI * 2,
        }));
    }, []);

    const spawnBurst = useCallback((x: number, y: number) => {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const a = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.4;
            const sp = Math.random() * 5 + 2;
            particles.current.push({
                x, y,
                vx: Math.cos(a) * sp,
                vy: Math.sin(a) * sp,
                life: 1, size: Math.random() * 3 + 1,
                alpha: 1,
            });
        }
    }, []);

    const spawnObstacle = useCallback(() => {
        const ring = Math.floor(Math.random() * RINGS.length);
        const arc = OBSTACLE_ARC - Math.random() * 0.3;
        const dir = Math.random() > 0.5 ? 1 : -1;
        const baseSpeed = 0.008 + Math.random() * 0.008;
        obstacles.current.push({
            ring,
            angle: Math.random() * Math.PI * 2,
            arc,
            speed: baseSpeed * speedMultiplier.current,
            direction: dir,
        });
    }, []);

    // Player action: switch orbit ring
    const switchRing = useCallback((direction: "in" | "out") => {
        if (gsRef.current !== "playing") return;
        if (direction === "out" && playerRing.current < RINGS.length - 1) {
            playerRing.current++;
        } else if (direction === "in" && playerRing.current > 0) {
            playerRing.current--;
        }
    }, []);

    // Reverse orbit direction
    const reverseOrbit = useCallback(() => {
        if (gsRef.current !== "playing") return;
        playerDirection.current *= -1;
    }, []);

    // Start game
    const startGame = useCallback(() => {
        playerAngle.current = 0;
        playerRing.current = 1;
        playerDirection.current = 1;
        obstacles.current = [];
        particles.current = [];
        trail.current = [];
        frame.current = 0;
        scoreRef.current = 0;
        shakeRef.current = 0;
        flashRef.current = 0;
        difficultyTimer.current = 0;
        speedMultiplier.current = 1;
        setScore(0);
        setGameState("playing");

        // Initial obstacles
        for (let i = 0; i < 2; i++) {
            const ring = i;
            obstacles.current.push({
                ring,
                angle: Math.random() * Math.PI * 2,
                arc: OBSTACLE_ARC,
                speed: 0.01 * (Math.random() > 0.5 ? 1 : -1),
                direction: Math.random() > 0.5 ? 1 : -1,
            });
        }
    }, []);

    // Input handling
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                if (gsRef.current === "idle" || gsRef.current === "dead") {
                    startGame();
                } else {
                    reverseOrbit();
                }
            }
            if (gsRef.current === "playing") {
                if (e.code === "ArrowUp" || e.key === "w" || e.key === "W") {
                    e.preventDefault();
                    switchRing("out");
                }
                if (e.code === "ArrowDown" || e.key === "s" || e.key === "S") {
                    e.preventDefault();
                    switchRing("in");
                }
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [switchRing, reverseOrbit, startGame]);

    // Main game loop
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
            initStars(canvas.width, canvas.height);
        };
        resize();
        window.addEventListener("resize", resize);

        let t = 0;

        const loop = () => {
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;
            const state = gsRef.current;
            t++;

            // Scale rings for screen size
            const scale = Math.min(w, h) / 420;
            const rings = RINGS.map(r => r * scale);

            // Shake
            if (shakeRef.current > 0) {
                ctx.save();
                ctx.translate(
                    (Math.random() - 0.5) * shakeRef.current * 3,
                    (Math.random() - 0.5) * shakeRef.current * 3,
                );
                shakeRef.current *= 0.88;
                if (shakeRef.current < 0.2) shakeRef.current = 0;
            }

            // Clear
            ctx.fillStyle = "#0a0a0a";
            ctx.fillRect(0, 0, w, h);

            // Flash
            if (flashRef.current > 0) {
                ctx.fillStyle = `rgba(255,100,100,${flashRef.current * 0.12})`;
                ctx.fillRect(0, 0, w, h);
                flashRef.current *= 0.9;
                if (flashRef.current < 0.01) flashRef.current = 0;
            }

            // Stars
            stars.current.forEach(s => {
                const a = s.alpha * (0.5 + 0.5 * Math.sin(t * s.twinkle + s.phase));
                ctx.fillStyle = `rgba(255,255,255,${a})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // ─── Draw Orbit Rings ───────────────────────
            rings.forEach((r, i) => {
                // Outer glow
                ctx.strokeStyle = `rgba(255,255,255,${i === playerRing.current && state === "playing" ? 0.12 : 0.04})`;
                ctx.lineWidth = i === playerRing.current && state === "playing" ? 2 : 1;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.stroke();

                // Ring label
                if (state === "idle") {
                    ctx.font = "400 9px 'Inter', system-ui, sans-serif";
                    ctx.fillStyle = "rgba(255,255,255,0.1)";
                    ctx.textAlign = "center";
                    ctx.fillText(`RING ${i + 1}`, cx, cy - r - 8);
                }
            });

            // Center hub
            const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 25 * scale);
            hubGrad.addColorStop(0, "rgba(255,255,255,0.08)");
            hubGrad.addColorStop(1, "transparent");
            ctx.fillStyle = hubGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, 25 * scale, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "rgba(255,255,255,0.15)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, 12 * scale, 0, Math.PI * 2);
            ctx.stroke();

            // Pulsing center dot
            pulseRef.current += 0.03;
            const pAlpha = 0.3 + 0.2 * Math.sin(pulseRef.current);
            ctx.fillStyle = `rgba(255,255,255,${pAlpha})`;
            ctx.beginPath();
            ctx.arc(cx, cy, 4 * scale, 0, Math.PI * 2);
            ctx.fill();

            // ─── Game Logic ─────────────────────────────
            if (state === "playing") {
                frame.current++;
                difficultyTimer.current++;

                // Increase difficulty every 300 frames (~5 sec)
                if (difficultyTimer.current % 300 === 0) {
                    speedMultiplier.current += 0.08;
                    spawnObstacle();
                }

                // Score every 60 frames (~1 sec)
                if (frame.current % 60 === 0) {
                    scoreRef.current++;
                    setScore(scoreRef.current);
                }

                // Move player
                playerAngle.current += PLAYER_ORBIT_SPEED * playerDirection.current * speedMultiplier.current;

                // Player position
                const pr = rings[playerRing.current];
                const px = cx + Math.cos(playerAngle.current) * pr;
                const py = cy + Math.sin(playerAngle.current) * pr;

                // Trail
                trail.current.push({ x: px, y: py, alpha: 0.5 });
                if (trail.current.length > 25) trail.current.shift();
                trail.current.forEach(tp => tp.alpha *= 0.92);

                // Move obstacles
                obstacles.current.forEach(ob => {
                    ob.angle += ob.speed * ob.direction;
                });

                // Collision check
                const pAngleNorm = ((playerAngle.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
                let dead = false;
                obstacles.current.forEach(ob => {
                    if (ob.ring !== playerRing.current) return;
                    const obStart = ((ob.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
                    const obEnd = ((obStart + ob.arc) % (Math.PI * 2));

                    let hit = false;
                    if (obEnd > obStart) {
                        hit = pAngleNorm >= obStart && pAngleNorm <= obEnd;
                    } else {
                        // Arc wraps around 0
                        hit = pAngleNorm >= obStart || pAngleNorm <= obEnd;
                    }

                    if (hit) dead = true;
                });

                if (dead) {
                    setGameState("dead");
                    spawnBurst(px, py);
                    shakeRef.current = 10;
                    flashRef.current = 1;
                    if (scoreRef.current > highRef.current) {
                        highRef.current = scoreRef.current;
                        setHighScore(scoreRef.current);
                        localStorage.setItem("oryxen-orbit-highscore", scoreRef.current.toString());
                    }
                }

                // ─── Draw Obstacles ─────────────────────
                obstacles.current.forEach(ob => {
                    const or = rings[ob.ring];
                    const obStart = ob.angle;

                    // Danger arc
                    ctx.strokeStyle = `rgba(255,80,80,${0.35 + 0.1 * Math.sin(t * 0.05)})`;
                    ctx.lineWidth = 10 * scale;
                    ctx.lineCap = "round";
                    ctx.beginPath();
                    ctx.arc(cx, cy, or, obStart, obStart + ob.arc);
                    ctx.stroke();

                    // Inner glow
                    ctx.strokeStyle = `rgba(255,80,80,${0.12 + 0.05 * Math.sin(t * 0.05)})`;
                    ctx.lineWidth = 20 * scale;
                    ctx.beginPath();
                    ctx.arc(cx, cy, or, obStart, obStart + ob.arc);
                    ctx.stroke();

                    // Edge dots
                    for (let end = 0; end <= 1; end++) {
                        const eAngle = obStart + ob.arc * end;
                        const ex = cx + Math.cos(eAngle) * or;
                        const ey = cy + Math.sin(eAngle) * or;
                        ctx.fillStyle = `rgba(255,80,80,0.6)`;
                        ctx.beginPath();
                        ctx.arc(ex, ey, 3 * scale, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                // ─── Draw Trail ─────────────────────────
                trail.current.forEach((tp, i) => {
                    if (i === 0) return;
                    const prev = trail.current[i - 1];
                    const grad = ctx.createLinearGradient(prev.x, prev.y, tp.x, tp.y);
                    grad.addColorStop(0, `rgba(255,255,255,${prev.alpha * 0.3})`);
                    grad.addColorStop(1, `rgba(255,255,255,${tp.alpha * 0.3})`);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(tp.x, tp.y);
                    ctx.stroke();
                });

                // ─── Draw Player ────────────────────────
                // Outer glow
                const pglow = ctx.createRadialGradient(px, py, 0, px, py, 30 * scale);
                pglow.addColorStop(0, "rgba(255,255,255,0.15)");
                pglow.addColorStop(1, "transparent");
                ctx.fillStyle = pglow;
                ctx.beginPath();
                ctx.arc(px, py, 30 * scale, 0, Math.PI * 2);
                ctx.fill();

                // Ring
                ctx.strokeStyle = "rgba(255,255,255,0.7)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(px, py, 8 * scale, 0, Math.PI * 2);
                ctx.stroke();

                // Core
                ctx.fillStyle = "rgba(255,255,255,0.95)";
                ctx.beginPath();
                ctx.arc(px, py, 4 * scale, 0, Math.PI * 2);
                ctx.fill();

                // Direction indicator
                const indAngle = playerAngle.current + (playerDirection.current * 0.4);
                const indX = cx + Math.cos(indAngle) * pr;
                const indY = cy + Math.sin(indAngle) * pr;
                ctx.fillStyle = "rgba(255,255,255,0.15)";
                ctx.beginPath();
                ctx.arc(indX, indY, 3 * scale, 0, Math.PI * 2);
                ctx.fill();
            }

            // ─── Draw Idle Player ───────────────────────
            if (state === "idle") {
                const idleR = rings[1];
                const idleAngle = t * 0.015;
                const ipx = cx + Math.cos(idleAngle) * idleR;
                const ipy = cy + Math.sin(idleAngle) * idleR;

                const iglow = ctx.createRadialGradient(ipx, ipy, 0, ipx, ipy, 25 * scale);
                iglow.addColorStop(0, "rgba(255,255,255,0.1)");
                iglow.addColorStop(1, "transparent");
                ctx.fillStyle = iglow;
                ctx.beginPath();
                ctx.arc(ipx, ipy, 25 * scale, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = "rgba(255,255,255,0.5)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(ipx, ipy, 7 * scale, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = "rgba(255,255,255,0.8)";
                ctx.beginPath();
                ctx.arc(ipx, ipy, 3 * scale, 0, Math.PI * 2);
                ctx.fill();

                // Idle demo obstacles
                for (let i = 0; i < 2; i++) {
                    const dr = rings[i * 2];
                    const da = t * (0.006 + i * 0.003) * (i % 2 === 0 ? 1 : -1);
                    ctx.strokeStyle = "rgba(255,80,80,0.15)";
                    ctx.lineWidth = 8 * scale;
                    ctx.lineCap = "round";
                    ctx.beginPath();
                    ctx.arc(cx, cy, dr, da, da + 0.8);
                    ctx.stroke();
                }
            }

            // ─── Particles ──────────────────────────────
            particles.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.98;
                p.vy *= 0.98;
                p.life -= 0.025;
                ctx.fillStyle = `rgba(255,255,255,${p.life * 0.7})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                ctx.fill();
            });
            particles.current = particles.current.filter(p => p.life > 0);

            // ─── UI Text ────────────────────────────────
            if (state === "playing") {
                ctx.font = "bold 48px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.06)";
                ctx.textAlign = "center";
                ctx.fillText(scoreRef.current.toString(), cx, 60);
            }

            if (state === "idle") {
                ctx.font = "600 22px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.7)";
                ctx.textAlign = "center";
                ctx.fillText("ORBIT   DODGE", cx, cy - rings[0] - 40 * scale);

                ctx.font = "300 12px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.25)";
                const isTouchDevice = 'ontouchstart' in window;
                if (isTouchDevice) {
                    ctx.fillText("Tap to start  ·  Swipe up/down to switch rings", cx, cy + rings[2] + 35 * scale);
                    ctx.fillText("Double-tap to reverse direction", cx, cy + rings[2] + 55 * scale);
                } else {
                    ctx.fillText("Space to start & reverse  ·  ↑↓ to switch rings", cx, cy + rings[2] + 35 * scale);
                }

                if (highRef.current > 0) {
                    ctx.font = "400 11px 'Inter', system-ui, sans-serif";
                    ctx.fillStyle = "rgba(255,255,255,0.15)";
                    ctx.fillText(`Best: ${highRef.current}s`, cx, cy + rings[2] + 75 * scale);
                }
            }

            if (state === "dead") {
                // Dark overlay
                ctx.fillStyle = "rgba(0,0,0,0.3)";
                ctx.fillRect(0, 0, w, h);

                ctx.font = "600 20px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.6)";
                ctx.textAlign = "center";
                ctx.fillText("ORBIT   CRASHED", cx, cy - 35);

                ctx.font = "bold 42px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.4)";
                ctx.fillText(`${scoreRef.current}s`, cx, cy + 15);

                if (scoreRef.current >= highRef.current && scoreRef.current > 0) {
                    ctx.font = "400 11px 'Inter', system-ui, sans-serif";
                    ctx.fillStyle = "rgba(255,200,50,0.5)";
                    ctx.fillText("NEW RECORD!", cx, cy + 35);
                }

                ctx.font = "300 12px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.2)";
                const isTouchDevice = 'ontouchstart' in window;
                ctx.fillText(isTouchDevice ? "Tap to retry" : "Space to retry", cx, cy + 65);
            }

            if (shakeRef.current > 0) ctx.restore();
            animId.current = requestAnimationFrame(loop);
        };

        animId.current = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(animId.current);
            window.removeEventListener("resize", resize);
        };
    }, [initStars, spawnBurst, spawnObstacle]);

    // Touch controls
    const touchStartY = useRef(0);
    const lastTap = useRef(0);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        const now = Date.now();
        touchStartY.current = e.touches[0].clientY;

        if (gsRef.current === "idle" || gsRef.current === "dead") {
            startGame();
            return;
        }

        // Double tap to reverse
        if (now - lastTap.current < 300) {
            reverseOrbit();
        }
        lastTap.current = now;
    }, [startGame, reverseOrbit]);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        if (gsRef.current !== "playing") return;
        const endY = e.changedTouches[0].clientY;
        const dy = touchStartY.current - endY;
        if (Math.abs(dy) > 20) {
            switchRing(dy > 0 ? "out" : "in");
        }
    }, [switchRing]);

    const handleClick = useCallback(() => {
        if (gsRef.current === "idle" || gsRef.current === "dead") {
            startGame();
        } else {
            reverseOrbit();
        }
    }, [startGame, reverseOrbit]);

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
                        Take a Break
                    </h2>
                    <h3 className="text-2xl md:text-3xl text-white font-medium tracking-tight mb-2">
                        Orbit Dodge
                    </h3>
                    <p className="text-zinc-500 text-sm max-w-md">
                        Navigate the rings. Dodge the arcs. Survive as long as you can.
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
                    style={{ height: isMobile ? "380px" : "480px" }}
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full cursor-pointer outline-none touch-none"
                        onClick={handleClick}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    />

                    {/* Score overlay */}
                    {gameState === "playing" && (
                        <div className="absolute top-4 right-4 flex items-center gap-3 pointer-events-none">
                            <div className="text-right">
                                <div className="text-[9px] text-zinc-600 tracking-widest">TIME</div>
                                <div className="text-lg font-light text-white/60 tabular-nums">{score}s</div>
                            </div>
                        </div>
                    )}

                    {/* Controls hint */}
                    {gameState === "playing" && (
                        <motion.div
                            className="absolute bottom-4 left-4 pointer-events-none"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ delay: 3, duration: 1 }}
                        >
                            <div className="text-[9px] text-zinc-700 tracking-widest">
                                {isMobile ? "SWIPE ↑↓ · DOUBLE-TAP REVERSE" : "↑↓ SWITCH · SPACE REVERSE"}
                            </div>
                        </motion.div>
                    )}

                    {/* High score badge */}
                    {highScore > 0 && gameState !== "playing" && (
                        <motion.div className="absolute top-4 right-4 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                            <div className="text-right">
                                <div className="text-[9px] text-zinc-600 tracking-widest">BEST</div>
                                <div className="text-sm font-light text-white/30">{highScore}s</div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </section>
    );
}
