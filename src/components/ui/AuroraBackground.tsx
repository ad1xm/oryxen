"use client";

import { useEffect, useRef } from "react";

export default function AuroraBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 2;
            const y = (clientY / window.innerHeight - 0.5) * 2;
            container.style.setProperty("--mouse-x", `${x * 15}px`);
            container.style.setProperty("--mouse-y", `${y * 15}px`);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden" style={{ "--mouse-x": "0px", "--mouse-y": "0px" } as React.CSSProperties}>
            {/* Layer 1: Mesh Gradient Blobs */}
            <div
                className="absolute animate-aurora-1"
                style={{
                    width: "60vw",
                    height: "60vh",
                    left: "10%",
                    top: "-10%",
                    background: "radial-gradient(ellipse at center, rgba(0, 212, 255, 0.08) 0%, rgba(10, 22, 40, 0.04) 50%, transparent 70%)",
                    filter: "blur(80px)",
                    transform: "translate(var(--mouse-x), var(--mouse-y))",
                }}
            />
            <div
                className="absolute animate-aurora-2"
                style={{
                    width: "50vw",
                    height: "50vh",
                    right: "-5%",
                    top: "20%",
                    background: "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.06) 0%, rgba(18, 8, 46, 0.03) 50%, transparent 70%)",
                    filter: "blur(100px)",
                    transform: "translate(calc(var(--mouse-x) * -0.5), calc(var(--mouse-y) * -0.5))",
                }}
            />
            <div
                className="absolute animate-aurora-3"
                style={{
                    width: "45vw",
                    height: "45vh",
                    left: "30%",
                    bottom: "0%",
                    background: "radial-gradient(ellipse at center, rgba(0, 212, 255, 0.05) 0%, rgba(59, 130, 246, 0.03) 40%, transparent 70%)",
                    filter: "blur(90px)",
                    transform: "translate(calc(var(--mouse-x) * 0.3), calc(var(--mouse-y) * 0.3))",
                }}
            />

            {/* Layer 2: Floating Orbs */}
            {[
                { size: 4, x: "15%", y: "20%", delay: "0s", duration: "8s", opacity: 0.3 },
                { size: 3, x: "75%", y: "15%", delay: "1s", duration: "10s", opacity: 0.2 },
                { size: 5, x: "60%", y: "60%", delay: "2s", duration: "12s", opacity: 0.25 },
                { size: 3, x: "25%", y: "70%", delay: "3s", duration: "9s", opacity: 0.2 },
                { size: 6, x: "85%", y: "45%", delay: "1.5s", duration: "11s", opacity: 0.15 },
                { size: 4, x: "45%", y: "30%", delay: "4s", duration: "13s", opacity: 0.2 },
                { size: 3, x: "10%", y: "50%", delay: "2.5s", duration: "10s", opacity: 0.15 },
                { size: 5, x: "50%", y: "80%", delay: "0.5s", duration: "9s", opacity: 0.2 },
            ].map((orb, i) => (
                <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: `${orb.size}px`,
                        height: `${orb.size}px`,
                        left: orb.x,
                        top: orb.y,
                        background: i % 2 === 0 ? "rgba(0, 212, 255, 0.8)" : "rgba(168, 85, 247, 0.7)",
                        boxShadow: i % 2 === 0
                            ? `0 0 ${orb.size * 3}px rgba(0, 212, 255, 0.3)`
                            : `0 0 ${orb.size * 3}px rgba(168, 85, 247, 0.3)`,
                        opacity: orb.opacity,
                        animation: `float-orb ${orb.duration} ease-in-out ${orb.delay} infinite`,
                    }}
                />
            ))}

            {/* Layer 3: Grid Overlay */}
            <div
                className="absolute inset-0 animate-grid-pulse"
                style={{
                    backgroundImage: `
            linear-gradient(to right, rgba(0, 212, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 212, 255, 0.02) 1px, transparent 1px)
          `,
                    backgroundSize: "60px 60px",
                    maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%)",
                }}
            />

            {/* Vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, #050505 100%)",
                }}
            />
        </div>
    );
}
