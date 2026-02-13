"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

// ─── Game Constants ─────────────────────────────────────────────
const GRAVITY = 0.6;
const JUMP_FORCE = -11;
const GROUND_OFFSET = 60;
const PLAYER_SIZE = 14;
const GAP_SIZE = 140;
const PILLAR_WIDTH = 32;
const PILLAR_SPEED_BASE = 2.8;
const PILLAR_INTERVAL_BASE = 120;
const PARTICLE_COUNT = 40;
const STAR_COUNT = 60;

interface Pillar {
    x: number;
    gapY: number;
    scored: boolean;
    width: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
}

interface Star {
    x: number;
    y: number;
    size: number;
    alpha: number;
    twinkleSpeed: number;
    twinklePhase: number;
}

export default function MiniGame() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

    const [gameState, setGameState] = useState<"idle" | "playing" | "dead">("idle");
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Game state refs (for animation loop)
    const gameStateRef = useRef(gameState);
    const scoreRef = useRef(0);
    const highScoreRef = useRef(0);
    const playerRef = useRef({ y: 0, vy: 0 });
    const pillarsRef = useRef<Pillar[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const starsRef = useRef<Star[]>([]);
    const frameRef = useRef(0);
    const animRef = useRef<number>(0);
    const shakeRef = useRef(0);
    const flashRef = useRef(0);

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Load high score
    useEffect(() => {
        const saved = localStorage.getItem("oryxen-game-highscore");
        if (saved) {
            highScoreRef.current = parseInt(saved);
            setHighScore(parseInt(saved));
        }
    }, []);

    // Init stars
    const initStars = useCallback((w: number, h: number) => {
        starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.4 + 0.1,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinklePhase: Math.random() * Math.PI * 2,
        }));
    }, []);

    // Spawn particles on death
    const spawnDeathParticles = useCallback((x: number, y: number) => {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.5;
            const speed = Math.random() * 4 + 1.5;
            particlesRef.current.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                maxLife: 1,
                size: Math.random() * 3 + 1,
            });
        }
    }, []);

    // Jump action
    const jump = useCallback(() => {
        if (gameStateRef.current === "playing") {
            playerRef.current.vy = JUMP_FORCE;
        }
    }, []);

    // Start/restart game
    const startGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const h = canvas.height;

        playerRef.current = { y: h / 2, vy: 0 };
        pillarsRef.current = [];
        particlesRef.current = [];
        frameRef.current = 0;
        scoreRef.current = 0;
        shakeRef.current = 0;
        flashRef.current = 0;
        setScore(0);
        setGameState("playing");
    }, []);

    // Handle input
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.code === "Space" || e.code === "ArrowUp" || e.key === "w" || e.key === "W") {
                e.preventDefault();
                if (gameStateRef.current === "idle" || gameStateRef.current === "dead") {
                    startGame();
                } else {
                    jump();
                }
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [jump, startGame]);

    // Main game loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const container = canvas.parentElement;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            initStars(canvas.width, canvas.height);
        };
        resize();
        window.addEventListener("resize", resize);

        const drawStars = (t: number) => {
            starsRef.current.forEach((star) => {
                const alpha = star.alpha * (0.5 + 0.5 * Math.sin(t * star.twinkleSpeed + star.twinklePhase));
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const drawGround = (w: number, h: number) => {
            const groundY = h - GROUND_OFFSET;
            ctx.strokeStyle = "rgba(255,255,255,0.08)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(w, groundY);
            ctx.stroke();

            // Grid lines below ground
            for (let i = 1; i <= 3; i++) {
                ctx.strokeStyle = `rgba(255,255,255,${0.03 / i})`;
                ctx.beginPath();
                ctx.moveTo(0, groundY + i * 15);
                ctx.lineTo(w, groundY + i * 15);
                ctx.stroke();
            }
        };

        const drawPlayer = (x: number, y: number, state: string) => {
            // Outer glow
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, PLAYER_SIZE * 3);
            gradient.addColorStop(0, state === "dead" ? "rgba(255,80,80,0.15)" : "rgba(255,255,255,0.12)");
            gradient.addColorStop(1, "transparent");
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, PLAYER_SIZE * 3, 0, Math.PI * 2);
            ctx.fill();

            // Core ring
            ctx.strokeStyle = state === "dead" ? "rgba(255,80,80,0.6)" : "rgba(255,255,255,0.6)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(x, y, PLAYER_SIZE, 0, Math.PI * 2);
            ctx.stroke();

            // Inner dot
            ctx.fillStyle = state === "dead" ? "rgba(255,80,80,0.9)" : "rgba(255,255,255,0.9)";
            ctx.beginPath();
            ctx.arc(x, y, PLAYER_SIZE * 0.4, 0, Math.PI * 2);
            ctx.fill();

            // Trail
            if (state === "playing") {
                const trail = ctx.createLinearGradient(x - 30, y, x, y);
                trail.addColorStop(0, "transparent");
                trail.addColorStop(1, "rgba(255,255,255,0.15)");
                ctx.strokeStyle = trail;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x - 30, y + playerRef.current.vy * 0.5);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        };

        const drawPillar = (pillar: Pillar, h: number) => {
            const groundY = h - GROUND_OFFSET;
            const topEnd = pillar.gapY - GAP_SIZE / 2;
            const botStart = pillar.gapY + GAP_SIZE / 2;

            // Top pillar
            const topGrad = ctx.createLinearGradient(pillar.x, 0, pillar.x + pillar.width, 0);
            topGrad.addColorStop(0, "rgba(255,255,255,0.06)");
            topGrad.addColorStop(0.5, "rgba(255,255,255,0.1)");
            topGrad.addColorStop(1, "rgba(255,255,255,0.06)");
            ctx.fillStyle = topGrad;
            ctx.fillRect(pillar.x, 0, pillar.width, topEnd);

            // Top pillar edge
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.lineWidth = 1;
            ctx.strokeRect(pillar.x, 0, pillar.width, topEnd);

            // Top cap
            ctx.fillStyle = "rgba(255,255,255,0.15)";
            ctx.fillRect(pillar.x - 4, topEnd - 4, pillar.width + 8, 4);

            // Bottom pillar
            ctx.fillStyle = topGrad;
            ctx.fillRect(pillar.x, botStart, pillar.width, groundY - botStart);
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.strokeRect(pillar.x, botStart, pillar.width, groundY - botStart);

            // Bottom cap
            ctx.fillStyle = "rgba(255,255,255,0.15)";
            ctx.fillRect(pillar.x - 4, botStart, pillar.width + 8, 4);

            // Gap glow
            const gapGrad = ctx.createRadialGradient(
                pillar.x + pillar.width / 2, pillar.gapY, 5,
                pillar.x + pillar.width / 2, pillar.gapY, GAP_SIZE * 0.6
            );
            gapGrad.addColorStop(0, "rgba(255,255,255,0.04)");
            gapGrad.addColorStop(1, "transparent");
            ctx.fillStyle = gapGrad;
            ctx.fillRect(pillar.x - 20, pillar.gapY - GAP_SIZE / 2, pillar.width + 40, GAP_SIZE);
        };

        const drawParticles = () => {
            particlesRef.current.forEach((p) => {
                ctx.fillStyle = `rgba(255,255,255,${p.life * 0.8})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const drawUI = (w: number, _h: number, state: string) => {
            if (state === "playing") {
                // Score
                ctx.font = "bold 48px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.08)";
                ctx.textAlign = "center";
                ctx.fillText(scoreRef.current.toString(), w / 2, 70);
            }

            if (state === "idle") {
                // Title
                ctx.font = "600 20px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.7)";
                ctx.textAlign = "center";
                ctx.fillText("VOID   RUNNER", w / 2, _h / 2 - 40);

                // Subtitle
                ctx.font = "300 13px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.3)";
                const isTouchDevice = 'ontouchstart' in window;
                ctx.fillText(
                    isTouchDevice ? "Tap to start  ·  Tap to jump" : "Press Space to start  ·  Space / ↑ to jump",
                    w / 2, _h / 2
                );

                // High score
                if (highScoreRef.current > 0) {
                    ctx.font = "400 11px 'Inter', system-ui, sans-serif";
                    ctx.fillStyle = "rgba(255,255,255,0.2)";
                    ctx.fillText(`Best: ${highScoreRef.current}`, w / 2, _h / 2 + 30);
                }
            }

            if (state === "dead") {
                // Death overlay
                ctx.font = "600 18px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.6)";
                ctx.textAlign = "center";
                ctx.fillText("GAME  OVER", w / 2, _h / 2 - 30);

                ctx.font = "bold 36px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.4)";
                ctx.fillText(scoreRef.current.toString(), w / 2, _h / 2 + 10);

                if (scoreRef.current >= highScoreRef.current && scoreRef.current > 0) {
                    ctx.font = "400 11px 'Inter', system-ui, sans-serif";
                    ctx.fillStyle = "rgba(255,200,50,0.5)";
                    ctx.fillText("NEW BEST!", w / 2, _h / 2 + 30);
                }

                ctx.font = "300 12px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.25)";
                const isTouchDevice = 'ontouchstart' in window;
                ctx.fillText(isTouchDevice ? "Tap to retry" : "Space to retry", w / 2, _h / 2 + 55);
            }
        };

        let t = 0;
        const loop = () => {
            const w = canvas.width;
            const h = canvas.height;
            const state = gameStateRef.current;
            t++;

            // Camera shake
            if (shakeRef.current > 0) {
                ctx.save();
                const sx = (Math.random() - 0.5) * shakeRef.current * 2;
                const sy = (Math.random() - 0.5) * shakeRef.current * 2;
                ctx.translate(sx, sy);
                shakeRef.current *= 0.9;
                if (shakeRef.current < 0.3) shakeRef.current = 0;
            }

            // Clear
            ctx.fillStyle = "#0a0a0a";
            ctx.fillRect(0, 0, w, h);

            // Flash on death
            if (flashRef.current > 0) {
                ctx.fillStyle = `rgba(255,255,255,${flashRef.current * 0.15})`;
                ctx.fillRect(0, 0, w, h);
                flashRef.current *= 0.85;
                if (flashRef.current < 0.01) flashRef.current = 0;
            }

            drawStars(t);
            drawGround(w, h);

            const playerX = w * 0.25;
            const groundY = h - GROUND_OFFSET;

            if (state === "playing") {
                frameRef.current++;
                const speedMultiplier = 1 + Math.floor(scoreRef.current / 5) * 0.15;
                const currentSpeed = PILLAR_SPEED_BASE * speedMultiplier;
                const currentInterval = Math.max(70, PILLAR_INTERVAL_BASE - Math.floor(scoreRef.current / 5) * 5);

                // Gravity
                playerRef.current.vy += GRAVITY;
                playerRef.current.y += playerRef.current.vy;

                // Ground / ceiling collision
                if (playerRef.current.y > groundY - PLAYER_SIZE) {
                    playerRef.current.y = groundY - PLAYER_SIZE;
                    // Die on ground hit
                    setGameState("dead");
                    spawnDeathParticles(playerX, playerRef.current.y);
                    shakeRef.current = 8;
                    flashRef.current = 1;
                    if (scoreRef.current > highScoreRef.current) {
                        highScoreRef.current = scoreRef.current;
                        setHighScore(scoreRef.current);
                        localStorage.setItem("oryxen-game-highscore", scoreRef.current.toString());
                    }
                }
                if (playerRef.current.y < PLAYER_SIZE) {
                    playerRef.current.y = PLAYER_SIZE;
                    playerRef.current.vy = 0;
                }

                // Spawn pillars
                if (frameRef.current % currentInterval === 0) {
                    const minGapY = GAP_SIZE / 2 + 40;
                    const maxGapY = groundY - GAP_SIZE / 2 - 40;
                    pillarsRef.current.push({
                        x: w + 20,
                        gapY: Math.random() * (maxGapY - minGapY) + minGapY,
                        scored: false,
                        width: PILLAR_WIDTH,
                    });
                }

                // Move & check pillars
                pillarsRef.current.forEach((pillar) => {
                    pillar.x -= currentSpeed;

                    // Score
                    if (!pillar.scored && pillar.x + pillar.width < playerX) {
                        pillar.scored = true;
                        scoreRef.current++;
                        setScore(scoreRef.current);
                    }

                    // Collision
                    if (gameStateRef.current === "playing") {
                        const topEnd = pillar.gapY - GAP_SIZE / 2;
                        const botStart = pillar.gapY + GAP_SIZE / 2;
                        const px = playerX;
                        const py = playerRef.current.y;

                        if (
                            px + PLAYER_SIZE > pillar.x &&
                            px - PLAYER_SIZE < pillar.x + pillar.width &&
                            (py - PLAYER_SIZE < topEnd || py + PLAYER_SIZE > botStart)
                        ) {
                            setGameState("dead");
                            spawnDeathParticles(px, py);
                            shakeRef.current = 10;
                            flashRef.current = 1;
                            if (scoreRef.current > highScoreRef.current) {
                                highScoreRef.current = scoreRef.current;
                                setHighScore(scoreRef.current);
                                localStorage.setItem("oryxen-game-highscore", scoreRef.current.toString());
                            }
                        }
                    }
                });

                // Remove off-screen pillars
                pillarsRef.current = pillarsRef.current.filter((p) => p.x + p.width > -20);
            }

            // Update particles
            particlesRef.current.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05;
                p.life -= 0.02;
            });
            particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

            // Draw
            pillarsRef.current.forEach((p) => drawPillar(p, h));
            drawParticles();

            if (state !== "idle" || state === "idle") {
                drawPlayer(playerX, state === "idle" ? h / 2 + 40 + Math.sin(t * 0.03) * 8 : playerRef.current.y, state);
            }

            drawUI(w, h, state);

            if (shakeRef.current > 0) ctx.restore();

            animRef.current = requestAnimationFrame(loop);
        };

        animRef.current = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [initStars, spawnDeathParticles]);

    const handleCanvasInteraction = () => {
        if (gameStateRef.current === "idle" || gameStateRef.current === "dead") {
            startGame();
        } else {
            jump();
        }
    };

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
                        Void Runner
                    </h3>
                    <p className="text-zinc-500 text-sm max-w-md">
                        Navigate through the void. Don&apos;t crash.
                    </p>
                </motion.div>
            </div>

            <motion.div
                className="container-width"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="relative rounded-2xl border border-zinc-800/50 overflow-hidden bg-[#0a0a0a]" style={{ height: isMobile ? "340px" : "420px" }}>
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full cursor-pointer outline-none"
                        onClick={handleCanvasInteraction}
                        onTouchStart={(e) => {
                            e.preventDefault();
                            handleCanvasInteraction();
                        }}
                    />

                    {/* Score overlay */}
                    {gameState === "playing" && (
                        <div className="absolute top-4 right-4 flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-[9px] text-zinc-600 tracking-widest">SCORE</div>
                                <div className="text-lg font-light text-white/60">{score}</div>
                            </div>
                        </div>
                    )}

                    {/* High score badge */}
                    {highScore > 0 && gameState !== "playing" && (
                        <motion.div
                            className="absolute top-4 right-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="text-right">
                                <div className="text-[9px] text-zinc-600 tracking-widest">BEST</div>
                                <div className="text-sm font-light text-white/30">{highScore}</div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </section>
    );
}
