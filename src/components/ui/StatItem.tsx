"use client";

import { motion, useTransform, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef } from "react";

export function StatItem({ stat, index }: { stat: any; index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    // Extract number from string (e.g. "2025" -> 2025, "7+" -> 7)
    const numericValue = parseInt(stat.value.replace(/\D/g, ""));
    const suffix = stat.value.replace(/[0-9]/g, "");

    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest) + suffix);

    useEffect(() => {
        if (isInView) {
            // Logic for "Founded": 2000 -> 2025
            // Logic for "Projects": 0 -> 7
            const startValue = stat.label === "Founded" ? 2000 : 0;
            count.set(startValue);

            const controls = animate(count, numericValue, {
                duration: 2.5,
                ease: "easeOut",
                delay: 0.2
            });

            return controls.stop;
        }
    }, [isInView, count, numericValue, stat.label]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 }}
            className="group"
        >
            <div className="text-xs font-mono text-zinc-600 mb-2 tracking-widest group-hover:text-zinc-400 transition-colors">
                {stat.label}
            </div>
            <div className="text-4xl md:text-5xl font-bold text-white tracking-tighter flex items-center">
                {stat.label === "Engineering Led" ? stat.value : <motion.span>{rounded}</motion.span>}
            </div>
        </motion.div>
    );
}
