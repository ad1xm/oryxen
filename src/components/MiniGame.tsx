"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

// ─── Config ─────────────────────────────────────────────────────
const PADDLE_HEIGHT = 12;
const BALL_RADIUS = 6;
const BALL_SPEED_BASE = 4.5;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_PADDING = 4;
const STAR_COUNT = 60;

interface Brick {
    x: number; y: number;
    w: number; h: number;
    alive: boolean;
    hits: number;      // hits remaining
    maxHits: number;
}

interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    life: number;
    size: number;
    brightness: number;
}

interface Star {
    x: number; y: number;
    size: number; alpha: number;
    twinkle: number; phase: number;
}

export default function MiniGame() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

    const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "dead">("idle");
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    const gsRef = useRef(gameState);
    const scoreRef = useRef(0);
    const highRef = useRef(0);
    const levelRef = useRef(1);
    const paddleX = useRef(0);
    const paddleW = useRef(100);
    const ballX = useRef(0);
    const ballY = useRef(0);
    const ballVX = useRef(0);
    const ballVY = useRef(0);
    const bricks = useRef<Brick[]>([]);
    const particles = useRef<Particle[]>([]);
    const starsArr = useRef<Star[]>([]);
    const animId = useRef(0);
    const shakeRef = useRef(0);
    const comboRef = useRef(0);
    const comboTimer = useRef(0);
    const mouseX = useRef(0);
    const livesRef = useRef(3);
    const [lives, setLives] = useState(3);

    useEffect(() => { gsRef.current = gameState; }, [gameState]);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const h = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("oryxen-breakout-high");
        if (saved) { highRef.current = parseInt(saved); setHighScore(parseInt(saved)); }
    }, []);

    const initStars = useCallback((w: number, h: number) => {
        starsArr.current = Array.from({ length: STAR_COUNT }, () => ({
            x: Math.random() * w, y: Math.random() * h,
            size: Math.random() * 1.2 + 0.3,
            alpha: Math.random() * 0.25 + 0.05,
            twinkle: Math.random() * 0.02 + 0.005,
            phase: Math.random() * Math.PI * 2,
        }));
    }, []);

    const spawnBrickParticles = useCallback((bx: number, by: number, bw: number, bh: number, brightness: number) => {
        const count = 12;
        for (let i = 0; i < count; i++) {
            const a = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const sp = Math.random() * 3 + 1;
            particles.current.push({
                x: bx + bw / 2 + (Math.random() - 0.5) * bw * 0.5,
                y: by + bh / 2 + (Math.random() - 0.5) * bh * 0.5,
                vx: Math.cos(a) * sp,
                vy: Math.sin(a) * sp,
                life: 1,
                size: Math.random() * 2.5 + 0.5,
                brightness,
            });
        }
    }, []);

    const buildLevel = useCallback((w: number, h: number, lvl: number) => {
        const brickArea = w - 40;
        const bw = (brickArea - (BRICK_COLS - 1) * BRICK_PADDING) / BRICK_COLS;
        const bh = 16;
        const topOffset = 60;
        const rows = Math.min(BRICK_ROWS + Math.floor((lvl - 1) * 0.5), 8);
        const newBricks: Brick[] = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < BRICK_COLS; c++) {
                const x = 20 + c * (bw + BRICK_PADDING);
                const y = topOffset + r * (bh + BRICK_PADDING);
                // Higher rows have more hits
                const maxHits = r < 2 ? (lvl > 2 ? 2 : 1) : 1;
                // Create patterns - some gaps for visual interest
                const hasGap = lvl > 1 && ((r + c) % (7 - Math.min(lvl, 4)) === 0);
                if (!hasGap) {
                    newBricks.push({ x, y, w: bw, h: bh, alive: true, hits: maxHits, maxHits });
                }
            }
        }
        return newBricks;
    }, []);

    const resetBall = useCallback((w: number, h: number) => {
        ballX.current = w / 2;
        ballY.current = h - 80;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
        const speed = BALL_SPEED_BASE + (levelRef.current - 1) * 0.3;
        ballVX.current = Math.cos(angle) * speed;
        ballVY.current = Math.sin(angle) * speed;
    }, []);

    const startGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const w = canvas.width;
        const h = canvas.height;

        paddleX.current = w / 2;
        paddleW.current = isMobile ? 80 : 100;
        scoreRef.current = 0;
        levelRef.current = 1;
        livesRef.current = 3;
        comboRef.current = 0;
        particles.current = [];
        setScore(0);
        setLevel(1);
        setLives(3);

        bricks.current = buildLevel(w, h, 1);
        resetBall(w, h);
        setGameState("playing");
    }, [buildLevel, resetBall, isMobile]);

    const nextLevel = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        levelRef.current++;
        setLevel(levelRef.current);
        paddleW.current = Math.max(60, paddleW.current - 5);
        bricks.current = buildLevel(canvas.width, canvas.height, levelRef.current);
        resetBall(canvas.width, canvas.height);
    }, [buildLevel, resetBall]);

    // Input
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                if (gsRef.current !== "playing") startGame();
            }
        };
        const handleMouse = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            mouseX.current = e.clientX - rect.left;
        };
        const handleTouch = (e: TouchEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            if (e.touches.length > 0) {
                mouseX.current = e.touches[0].clientX - rect.left;
            }
        };

        window.addEventListener("keydown", handleKey);
        window.addEventListener("mousemove", handleMouse);
        window.addEventListener("touchmove", handleTouch, { passive: true });
        window.addEventListener("touchstart", handleTouch, { passive: true });
        return () => {
            window.removeEventListener("keydown", handleKey);
            window.removeEventListener("mousemove", handleMouse);
            window.removeEventListener("touchmove", handleTouch);
            window.removeEventListener("touchstart", handleTouch);
        };
    }, [startGame]);

    // Game loop
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
            mouseX.current = canvas.width / 2;
        };
        resize();
        window.addEventListener("resize", resize);

        let t = 0;

        const loop = () => {
            const w = canvas.width;
            const h = canvas.height;
            const state = gsRef.current;
            t++;

            // Shake
            if (shakeRef.current > 0) {
                ctx.save();
                ctx.translate(
                    (Math.random() - 0.5) * shakeRef.current * 2,
                    (Math.random() - 0.5) * shakeRef.current * 2,
                );
                shakeRef.current *= 0.85;
                if (shakeRef.current < 0.2) shakeRef.current = 0;
            }

            // Clear
            ctx.fillStyle = "#0a0a0a";
            ctx.fillRect(0, 0, w, h);

            // Stars
            starsArr.current.forEach(s => {
                const a = s.alpha * (0.5 + 0.5 * Math.sin(t * s.twinkle + s.phase));
                ctx.fillStyle = `rgba(255,255,255,${a})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // Combo timer
            if (comboTimer.current > 0) comboTimer.current--;
            if (comboTimer.current === 0) comboRef.current = 0;

            const groundY = h - 30;

            if (state === "playing") {
                // ─── Move Paddle ─────────────────────
                const targetPX = Math.max(paddleW.current / 2, Math.min(w - paddleW.current / 2, mouseX.current));
                paddleX.current += (targetPX - paddleX.current) * 0.25;

                // ─── Move Ball ───────────────────────
                ballX.current += ballVX.current;
                ballY.current += ballVY.current;

                // Wall bounce
                if (ballX.current - BALL_RADIUS <= 0) {
                    ballX.current = BALL_RADIUS;
                    ballVX.current = Math.abs(ballVX.current);
                }
                if (ballX.current + BALL_RADIUS >= w) {
                    ballX.current = w - BALL_RADIUS;
                    ballVX.current = -Math.abs(ballVX.current);
                }
                if (ballY.current - BALL_RADIUS <= 0) {
                    ballY.current = BALL_RADIUS;
                    ballVY.current = Math.abs(ballVY.current);
                }

                // Ball falls below paddle
                if (ballY.current > groundY + 20) {
                    livesRef.current--;
                    setLives(livesRef.current);
                    shakeRef.current = 6;

                    if (livesRef.current <= 0) {
                        // Game over
                        setGameState("dead");
                        shakeRef.current = 10;
                        // Explode remaining bricks
                        bricks.current.filter(b => b.alive).slice(0, 10).forEach(b => {
                            spawnBrickParticles(b.x, b.y, b.w, b.h, 0.4);
                        });
                        if (scoreRef.current > highRef.current) {
                            highRef.current = scoreRef.current;
                            setHighScore(scoreRef.current);
                            localStorage.setItem("oryxen-breakout-high", scoreRef.current.toString());
                        }
                    } else {
                        resetBall(w, h);
                    }
                }

                // Paddle collision
                const pLeft = paddleX.current - paddleW.current / 2;
                const pRight = paddleX.current + paddleW.current / 2;
                const pTop = groundY - PADDLE_HEIGHT / 2;

                if (
                    ballY.current + BALL_RADIUS >= pTop &&
                    ballY.current - BALL_RADIUS <= pTop + PADDLE_HEIGHT &&
                    ballX.current >= pLeft &&
                    ballX.current <= pRight &&
                    ballVY.current > 0
                ) {
                    // Reflect with angle depending on where ball hit paddle
                    const hitPos = (ballX.current - paddleX.current) / (paddleW.current / 2); // -1 to 1
                    const angle = hitPos * (Math.PI / 3) - Math.PI / 2;
                    const speed = Math.sqrt(ballVX.current ** 2 + ballVY.current ** 2);
                    const newSpeed = Math.min(speed * 1.005, 9); // Slight acceleration, capped
                    ballVX.current = Math.cos(angle) * newSpeed;
                    ballVY.current = Math.sin(angle) * newSpeed;
                    ballY.current = pTop - BALL_RADIUS;

                    // Paddle hit particle
                    for (let i = 0; i < 5; i++) {
                        particles.current.push({
                            x: ballX.current,
                            y: pTop,
                            vx: (Math.random() - 0.5) * 3,
                            vy: -(Math.random() * 2 + 1),
                            life: 0.6,
                            size: Math.random() * 2 + 0.5,
                            brightness: 0.6,
                        });
                    }
                }

                // Brick collision
                let hitBrick = false;
                bricks.current.forEach(brick => {
                    if (!brick.alive) return;

                    const bLeft = brick.x;
                    const bRight = brick.x + brick.w;
                    const bTop = brick.y;
                    const bBottom = brick.y + brick.h;

                    if (
                        ballX.current + BALL_RADIUS > bLeft &&
                        ballX.current - BALL_RADIUS < bRight &&
                        ballY.current + BALL_RADIUS > bTop &&
                        ballY.current - BALL_RADIUS < bBottom
                    ) {
                        brick.hits--;

                        if (brick.hits <= 0) {
                            brick.alive = false;
                            hitBrick = true;

                            // Score with combo
                            comboRef.current++;
                            comboTimer.current = 90; // 1.5 sec
                            const points = 10 * comboRef.current * levelRef.current;
                            scoreRef.current += points;
                            setScore(scoreRef.current);

                            spawnBrickParticles(brick.x, brick.y, brick.w, brick.h,
                                Math.min(1, 0.4 + comboRef.current * 0.1));
                        }

                        // Determine bounce direction
                        const overlapLeft = (ballX.current + BALL_RADIUS) - bLeft;
                        const overlapRight = bRight - (ballX.current - BALL_RADIUS);
                        const overlapTop = (ballY.current + BALL_RADIUS) - bTop;
                        const overlapBottom = bBottom - (ballY.current - BALL_RADIUS);

                        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                        if (minOverlap === overlapTop || minOverlap === overlapBottom) {
                            ballVY.current = -ballVY.current;
                        } else {
                            ballVX.current = -ballVX.current;
                        }
                    }
                });

                if (hitBrick) shakeRef.current = Math.min(3, shakeRef.current + 1.5);

                // Check win
                if (bricks.current.every(b => !b.alive)) {
                    nextLevel();
                }
            }

            // ─── Draw Bricks ─────────────────────────
            bricks.current.forEach(brick => {
                if (!brick.alive) return;

                const brightness = brick.hits / brick.maxHits;
                const alpha = 0.15 + brightness * 0.25;

                // Brick body
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.beginPath();
                ctx.roundRect(brick.x, brick.y, brick.w, brick.h, 3);
                ctx.fill();

                // Border
                ctx.strokeStyle = `rgba(255,255,255,${alpha + 0.1})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.roundRect(brick.x, brick.y, brick.w, brick.h, 3);
                ctx.stroke();

                // Strong brick indicator
                if (brick.hits > 1) {
                    ctx.fillStyle = `rgba(255,255,255,${0.3})`;
                    ctx.beginPath();
                    ctx.arc(brick.x + brick.w / 2, brick.y + brick.h / 2, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // ─── Draw Paddle ─────────────────────────
            const paddleY = groundY - PADDLE_HEIGHT / 2;
            const pw = state === "idle" ? 100 : paddleW.current;
            const px = state === "idle" ? w / 2 : paddleX.current;

            // Paddle glow
            const pGlow = ctx.createRadialGradient(px, paddleY, 0, px, paddleY, pw);
            pGlow.addColorStop(0, "rgba(255,255,255,0.06)");
            pGlow.addColorStop(1, "transparent");
            ctx.fillStyle = pGlow;
            ctx.fillRect(px - pw, paddleY - 20, pw * 2, 40);

            // Paddle body
            const pGrad = ctx.createLinearGradient(px - pw / 2, paddleY, px + pw / 2, paddleY);
            pGrad.addColorStop(0, "rgba(255,255,255,0.1)");
            pGrad.addColorStop(0.5, "rgba(255,255,255,0.5)");
            pGrad.addColorStop(1, "rgba(255,255,255,0.1)");
            ctx.fillStyle = pGrad;
            ctx.beginPath();
            ctx.roundRect(px - pw / 2, paddleY, pw, PADDLE_HEIGHT, 6);
            ctx.fill();

            ctx.strokeStyle = "rgba(255,255,255,0.3)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(px - pw / 2, paddleY, pw, PADDLE_HEIGHT, 6);
            ctx.stroke();

            // ─── Draw Ball ───────────────────────────
            const bx = state === "idle" ? w / 2 + Math.sin(t * 0.02) * 30 : ballX.current;
            const by = state === "idle" ? groundY - 60 + Math.cos(t * 0.03) * 15 : ballY.current;

            // Ball glow
            const bGlow = ctx.createRadialGradient(bx, by, 0, bx, by, 25);
            bGlow.addColorStop(0, "rgba(255,255,255,0.2)");
            bGlow.addColorStop(1, "transparent");
            ctx.fillStyle = bGlow;
            ctx.beginPath();
            ctx.arc(bx, by, 25, 0, Math.PI * 2);
            ctx.fill();

            // Ball
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.beginPath();
            ctx.arc(bx, by, BALL_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "rgba(255,255,255,0.4)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(bx, by, BALL_RADIUS + 2, 0, Math.PI * 2);
            ctx.stroke();

            // ─── Particles ──────────────────────────
            particles.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.04;
                p.vx *= 0.99;
                p.life -= 0.02;
                ctx.fillStyle = `rgba(255,255,255,${p.life * p.brightness})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                ctx.fill();
            });
            particles.current = particles.current.filter(p => p.life > 0);

            // ─── Ground line ────────────────────────
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, groundY + PADDLE_HEIGHT);
            ctx.lineTo(w, groundY + PADDLE_HEIGHT);
            ctx.stroke();

            // ─── Combo display ──────────────────────
            if (state === "playing" && comboRef.current > 1) {
                ctx.font = `bold ${14 + comboRef.current}px 'Inter', system-ui, sans-serif`;
                ctx.fillStyle = `rgba(255,255,255,${Math.min(0.5, 0.15 + comboRef.current * 0.05)})`;
                ctx.textAlign = "center";
                ctx.fillText(`${comboRef.current}x COMBO`, w / 2, h / 2);
            }

            // ─── UI ─────────────────────────────────
            if (state === "playing") {
                // Lives
                for (let i = 0; i < livesRef.current; i++) {
                    ctx.fillStyle = "rgba(255,255,255,0.3)";
                    ctx.beginPath();
                    ctx.arc(20 + i * 18, h - 14, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            if (state === "idle") {
                // Idle bricks preview
                const previewBricks = buildLevel(w, h, 1);
                previewBricks.forEach(brick => {
                    ctx.fillStyle = `rgba(255,255,255,0.08)`;
                    ctx.beginPath();
                    ctx.roundRect(brick.x, brick.y, brick.w, brick.h, 3);
                    ctx.fill();
                    ctx.strokeStyle = "rgba(255,255,255,0.06)";
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                });

                ctx.font = "600 22px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.7)";
                ctx.textAlign = "center";
                ctx.fillText("NEON   BREAKOUT", w / 2, h / 2 - 10);

                ctx.font = "300 12px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.25)";
                const isTouchDevice = 'ontouchstart' in window;
                ctx.fillText(
                    isTouchDevice ? "Tap to start  ·  Slide to move paddle" : "Press Space to start  ·  Mouse to move paddle",
                    w / 2, h / 2 + 15
                );

                if (highRef.current > 0) {
                    ctx.font = "400 11px 'Inter', system-ui, sans-serif";
                    ctx.fillStyle = "rgba(255,255,255,0.15)";
                    ctx.fillText(`Best: ${highRef.current}`, w / 2, h / 2 + 40);
                }
            }

            if (state === "dead") {
                ctx.fillStyle = "rgba(0,0,0,0.35)";
                ctx.fillRect(0, 0, w, h);

                ctx.font = "600 20px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.6)";
                ctx.textAlign = "center";
                ctx.fillText("GAME   OVER", w / 2, h / 2 - 35);

                ctx.font = "bold 42px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.4)";
                ctx.fillText(scoreRef.current.toString(), w / 2, h / 2 + 12);

                ctx.font = "400 11px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.2)";
                ctx.fillText(`Level ${levelRef.current}`, w / 2, h / 2 + 32);

                if (scoreRef.current >= highRef.current && scoreRef.current > 0) {
                    ctx.fillStyle = "rgba(255,200,50,0.5)";
                    ctx.fillText("NEW RECORD!", w / 2, h / 2 + 50);
                }

                ctx.font = "300 12px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.2)";
                const isTouchDevice = 'ontouchstart' in window;
                ctx.fillText(isTouchDevice ? "Tap to retry" : "Space to retry", w / 2, h / 2 + 75);
            }

            if (shakeRef.current > 0) ctx.restore();
            animId.current = requestAnimationFrame(loop);
        };

        animId.current = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(animId.current);
            window.removeEventListener("resize", resize);
        };
    }, [initStars, spawnBrickParticles, buildLevel, nextLevel, resetBall]);

    const handleClick = useCallback(() => {
        if (gsRef.current !== "playing") startGame();
    }, [startGame]);

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
                        Neon Breakout
                    </h3>
                    <p className="text-zinc-500 text-sm max-w-md">
                        Smash the grid. Chain combos. How far can you go?
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
                    style={{ height: isMobile ? "400px" : "480px" }}
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full cursor-pointer outline-none touch-none"
                        onClick={handleClick}
                        onTouchStart={handleClick}
                    />

                    {/* Score + Level overlay */}
                    {gameState === "playing" && (
                        <div className="absolute top-4 right-4 flex items-center gap-5 pointer-events-none">
                            <div className="text-right">
                                <div className="text-[9px] text-zinc-600 tracking-widest">LVL</div>
                                <div className="text-sm font-light text-white/40 tabular-nums">{level}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] text-zinc-600 tracking-widest">SCORE</div>
                                <div className="text-lg font-light text-white/60 tabular-nums">{score}</div>
                            </div>
                        </div>
                    )}

                    {/* Lives */}
                    {gameState === "playing" && (
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 pointer-events-none">
                            {Array.from({ length: lives }).map((_, i) => (
                                <div key={i} className="w-2 h-2 rounded-full bg-white/30" />
                            ))}
                        </div>
                    )}

                    {/* High score badge */}
                    {highScore > 0 && gameState !== "playing" && (
                        <motion.div className="absolute top-4 right-4 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
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
