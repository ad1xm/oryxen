"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

// ─── Config ─────────────────────────────────────────────────────
const CELL_SIZE = 18;
const TICK_BASE = 130; // ms per move (lower = faster)
const TICK_MIN = 65;   // fastest possible tick
const FOOD_GLOW_SIZE = 8;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

const DIR_MAP: Record<Dir, Point> = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
};

const OPPOSITE: Record<Dir, Dir> = {
    UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT",
};

export default function MiniGame() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

    const [gameState, setGameState] = useState<"idle" | "playing" | "dead">("idle");
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Game refs (mutable state for the game loop)
    const gsRef = useRef(gameState);
    const scoreRef = useRef(0);
    const highRef = useRef(0);
    const snakeRef = useRef<Point[]>([]);
    const dirRef = useRef<Dir>("RIGHT");
    const nextDirRef = useRef<Dir>("RIGHT");
    const foodRef = useRef<Point>({ x: 5, y: 5 });
    const gridW = useRef(20);
    const gridH = useRef(15);
    const lastTick = useRef(0);
    const animId = useRef(0);
    const foodPulse = useRef(0);

    // Swipe tracking
    const touchStart = useRef<{ x: number; y: number } | null>(null);

    // Small eat particles (very lightweight)
    const eatParticles = useRef<{ x: number; y: number; vx: number; vy: number; life: number }[]>([]);

    useEffect(() => { gsRef.current = gameState; }, [gameState]);

    // Detect mobile
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Load high score
    useEffect(() => {
        const saved = localStorage.getItem("oryxen-snake-high");
        if (saved) { highRef.current = parseInt(saved); setHighScore(parseInt(saved)); }
    }, []);

    // Place food at random empty cell
    const placeFood = useCallback(() => {
        const snake = snakeRef.current;
        const occupied = new Set(snake.map(p => `${p.x},${p.y}`));
        const empty: Point[] = [];
        for (let x = 0; x < gridW.current; x++) {
            for (let y = 0; y < gridH.current; y++) {
                if (!occupied.has(`${x},${y}`)) empty.push({ x, y });
            }
        }
        if (empty.length > 0) {
            foodRef.current = empty[Math.floor(Math.random() * empty.length)];
        }
    }, []);

    // Start game
    const startGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Compute grid
        const cellSize = isMobile ? 14 : CELL_SIZE;
        gridW.current = Math.floor(canvas.width / cellSize);
        gridH.current = Math.floor(canvas.height / cellSize);

        // Center snake
        const cx = Math.floor(gridW.current / 2);
        const cy = Math.floor(gridH.current / 2);
        snakeRef.current = [
            { x: cx, y: cy },
            { x: cx - 1, y: cy },
            { x: cx - 2, y: cy },
        ];

        dirRef.current = "RIGHT";
        nextDirRef.current = "RIGHT";
        scoreRef.current = 0;
        eatParticles.current = [];
        setScore(0);

        placeFood();
        lastTick.current = performance.now();
        setGameState("playing");
    }, [isMobile, placeFood]);

    // ─── Input Handlers ───────────────────────────────────────────
    useEffect(() => {
        const setDir = (d: Dir) => {
            if (OPPOSITE[d] !== dirRef.current) {
                nextDirRef.current = d;
            }
        };

        const handleKey = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                if (gsRef.current !== "playing") startGame();
                return;
            }
            const map: Record<string, Dir> = {
                ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
                KeyW: "UP", KeyS: "DOWN", KeyA: "LEFT", KeyD: "RIGHT",
            };
            if (map[e.code]) {
                e.preventDefault();
                setDir(map[e.code]);
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStart.current || e.changedTouches.length === 0) return;
            const dx = e.changedTouches[0].clientX - touchStart.current.x;
            const dy = e.changedTouches[0].clientY - touchStart.current.y;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            // Minimum swipe distance
            if (Math.max(absDx, absDy) < 20) {
                // Tap — start game if not playing
                if (gsRef.current !== "playing") startGame();
                return;
            }

            if (absDx > absDy) {
                setDir(dx > 0 ? "RIGHT" : "LEFT");
            } else {
                setDir(dy > 0 ? "DOWN" : "UP");
            }
            touchStart.current = null;
        };

        window.addEventListener("keydown", handleKey);
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });
        return () => {
            window.removeEventListener("keydown", handleKey);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [startGame]);

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
        };
        resize();
        window.addEventListener("resize", resize);

        let idleT = 0;

        const loop = (now: number) => {
            const w = canvas.width;
            const h = canvas.height;
            const state = gsRef.current;
            const cellSize = w < 768 ? 14 : CELL_SIZE;

            // Recompute grid size each frame (handles resize)
            gridW.current = Math.floor(w / cellSize);
            gridH.current = Math.floor(h / cellSize);

            // Grid offset to center
            const offsetX = Math.floor((w - gridW.current * cellSize) / 2);
            const offsetY = Math.floor((h - gridH.current * cellSize) / 2);

            // ─── Tick (move snake) ─────────────────
            if (state === "playing") {
                const tickSpeed = Math.max(TICK_MIN, TICK_BASE - snakeRef.current.length * 1.5);
                if (now - lastTick.current >= tickSpeed) {
                    lastTick.current = now;
                    dirRef.current = nextDirRef.current;
                    const head = snakeRef.current[0];
                    const d = DIR_MAP[dirRef.current];
                    const newHead: Point = { x: head.x + d.x, y: head.y + d.y };

                    // Check wall collision
                    if (newHead.x < 0 || newHead.x >= gridW.current ||
                        newHead.y < 0 || newHead.y >= gridH.current) {
                        // Die
                        setGameState("dead");
                        if (scoreRef.current > highRef.current) {
                            highRef.current = scoreRef.current;
                            setHighScore(scoreRef.current);
                            localStorage.setItem("oryxen-snake-high", scoreRef.current.toString());
                        }
                    }
                    // Check self collision
                    else if (snakeRef.current.some(p => p.x === newHead.x && p.y === newHead.y)) {
                        setGameState("dead");
                        if (scoreRef.current > highRef.current) {
                            highRef.current = scoreRef.current;
                            setHighScore(scoreRef.current);
                            localStorage.setItem("oryxen-snake-high", scoreRef.current.toString());
                        }
                    } else {
                        snakeRef.current.unshift(newHead);

                        // Check food
                        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
                            scoreRef.current += 10;
                            setScore(scoreRef.current);

                            // Small eat particles
                            const fx = offsetX + foodRef.current.x * cellSize + cellSize / 2;
                            const fy = offsetY + foodRef.current.y * cellSize + cellSize / 2;
                            for (let i = 0; i < 8; i++) {
                                const angle = (Math.PI * 2 * i) / 8;
                                eatParticles.current.push({
                                    x: fx, y: fy,
                                    vx: Math.cos(angle) * (1.5 + Math.random()),
                                    vy: Math.sin(angle) * (1.5 + Math.random()),
                                    life: 1,
                                });
                            }

                            placeFood();
                            // Don't pop tail (snake grows)
                        } else {
                            snakeRef.current.pop();
                        }
                    }
                }
            }

            // ─── Clear ────────────────────────────────
            ctx.fillStyle = "#0a0a0a";
            ctx.fillRect(0, 0, w, h);

            // ─── Grid lines (subtle) ──────────────────
            ctx.strokeStyle = "rgba(255,255,255,0.02)";
            ctx.lineWidth = 0.5;
            for (let x = 0; x <= gridW.current; x++) {
                ctx.beginPath();
                ctx.moveTo(offsetX + x * cellSize, offsetY);
                ctx.lineTo(offsetX + x * cellSize, offsetY + gridH.current * cellSize);
                ctx.stroke();
            }
            for (let y = 0; y <= gridH.current; y++) {
                ctx.beginPath();
                ctx.moveTo(offsetX, offsetY + y * cellSize);
                ctx.lineTo(offsetX + gridW.current * cellSize, offsetY + y * cellSize);
                ctx.stroke();
            }

            // ─── Border ───────────────────────────────
            ctx.strokeStyle = "rgba(255,255,255,0.06)";
            ctx.lineWidth = 1;
            ctx.strokeRect(offsetX, offsetY, gridW.current * cellSize, gridH.current * cellSize);

            // ─── Food ─────────────────────────────────
            foodPulse.current += 0.04;
            const fp = foodRef.current;
            const fx = offsetX + fp.x * cellSize;
            const fy = offsetY + fp.y * cellSize;
            const pulse = 0.5 + 0.5 * Math.sin(foodPulse.current);

            if (state === "playing" || state === "idle") {
                // Food glow
                const glow = ctx.createRadialGradient(
                    fx + cellSize / 2, fy + cellSize / 2, 0,
                    fx + cellSize / 2, fy + cellSize / 2, cellSize + FOOD_GLOW_SIZE * pulse,
                );
                glow.addColorStop(0, `rgba(255,255,255,${0.08 + 0.04 * pulse})`);
                glow.addColorStop(1, "transparent");
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(fx + cellSize / 2, fy + cellSize / 2, cellSize + FOOD_GLOW_SIZE * pulse, 0, Math.PI * 2);
                ctx.fill();

                // Food cell
                const pad = 2;
                ctx.fillStyle = `rgba(255,255,255,${0.6 + 0.2 * pulse})`;
                ctx.beginPath();
                ctx.roundRect(fx + pad, fy + pad, cellSize - pad * 2, cellSize - pad * 2, 3);
                ctx.fill();
            }

            // ─── Snake ────────────────────────────────
            const snake = state === "idle" ? getIdleSnake(gridW.current, gridH.current, idleT++) : snakeRef.current;

            snake.forEach((seg, i) => {
                const sx = offsetX + seg.x * cellSize;
                const sy = offsetY + seg.y * cellSize;
                const pad = 1;

                // Head is brighter
                const isHead = i === 0;
                const alpha = isHead ? 0.85 : Math.max(0.12, 0.5 - i * 0.015);

                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.beginPath();
                ctx.roundRect(sx + pad, sy + pad, cellSize - pad * 2, cellSize - pad * 2, isHead ? 4 : 2);
                ctx.fill();

                // Head glow
                if (isHead && state === "playing") {
                    const hGlow = ctx.createRadialGradient(
                        sx + cellSize / 2, sy + cellSize / 2, 0,
                        sx + cellSize / 2, sy + cellSize / 2, cellSize * 1.5,
                    );
                    hGlow.addColorStop(0, "rgba(255,255,255,0.08)");
                    hGlow.addColorStop(1, "transparent");
                    ctx.fillStyle = hGlow;
                    ctx.beginPath();
                    ctx.arc(sx + cellSize / 2, sy + cellSize / 2, cellSize * 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // ─── Particles ────────────────────────────
            eatParticles.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.04;
                ctx.fillStyle = `rgba(255,255,255,${p.life * 0.6})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5 * p.life, 0, Math.PI * 2);
                ctx.fill();
            });
            eatParticles.current = eatParticles.current.filter(p => p.life > 0);

            // ─── UI Overlays ──────────────────────────
            if (state === "idle") {
                ctx.font = "600 22px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.7)";
                ctx.textAlign = "center";
                ctx.fillText("NEON   SNAKE", w / 2, h / 2 - 10);

                ctx.font = "300 12px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.25)";
                const isTouchDevice = "ontouchstart" in window;
                ctx.fillText(
                    isTouchDevice ? "Tap to start  ·  Swipe to steer" : "Press Space to start  ·  Arrow keys to steer",
                    w / 2, h / 2 + 15,
                );

                if (highRef.current > 0) {
                    ctx.font = "400 11px 'Inter', system-ui, sans-serif";
                    ctx.fillStyle = "rgba(255,255,255,0.15)";
                    ctx.fillText(`Best: ${highRef.current}`, w / 2, h / 2 + 40);
                }
            }

            if (state === "dead") {
                ctx.fillStyle = "rgba(0,0,0,0.4)";
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
                ctx.fillText(`Length: ${snakeRef.current.length}`, w / 2, h / 2 + 32);

                if (scoreRef.current >= highRef.current && scoreRef.current > 0) {
                    ctx.fillStyle = "rgba(255,200,50,0.5)";
                    ctx.fillText("NEW RECORD!", w / 2, h / 2 + 50);
                }

                ctx.font = "300 12px 'Inter', system-ui, sans-serif";
                ctx.fillStyle = "rgba(255,255,255,0.2)";
                const isTouchDevice = "ontouchstart" in window;
                ctx.fillText(isTouchDevice ? "Tap to retry" : "Space to retry", w / 2, h / 2 + 75);
            }

            animId.current = requestAnimationFrame(loop);
        };

        animId.current = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(animId.current);
            window.removeEventListener("resize", resize);
        };
    }, [placeFood]);

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
                        Neon Snake
                    </h3>
                    <p className="text-zinc-500 text-sm max-w-md">
                        Eat. Grow. Survive. How long can you last?
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

                    {/* Score overlay */}
                    {gameState === "playing" && (
                        <div className="absolute top-4 right-4 flex items-center gap-5 pointer-events-none">
                            <div className="text-right">
                                <div className="text-[9px] text-zinc-600 tracking-widest">LENGTH</div>
                                <div className="text-sm font-light text-white/40 tabular-nums">
                                    {snakeRef.current.length}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] text-zinc-600 tracking-widest">SCORE</div>
                                <div className="text-lg font-light text-white/60 tabular-nums">{score}</div>
                            </div>
                        </div>
                    )}

                    {/* High score badge */}
                    {highScore > 0 && gameState !== "playing" && (
                        <motion.div
                            className="absolute top-4 right-4 pointer-events-none"
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

// ─── Idle demo snake (deterministic looping path) ──────────────
function getIdleSnake(gw: number, gh: number, t: number): Point[] {
    // Create a simple looping path in the center
    const cx = Math.floor(gw / 2);
    const cy = Math.floor(gh / 2);
    const radius = 4;
    const path: Point[] = [];

    // Build a rectangle path
    for (let x = cx - radius; x <= cx + radius; x++) path.push({ x, y: cy - radius });
    for (let y = cy - radius + 1; y <= cy + radius; y++) path.push({ x: cx + radius, y });
    for (let x = cx + radius - 1; x >= cx - radius; x--) path.push({ x, y: cy + radius });
    for (let y = cy + radius - 1; y > cy - radius; y--) path.push({ x: cx - radius, y });

    const len = 8;
    const offset = Math.floor(t / 6) % path.length;
    const snake: Point[] = [];
    for (let i = 0; i < len; i++) {
        const idx = (offset - i + path.length * 10) % path.length;
        snake.push(path[idx]);
    }
    return snake;
}
