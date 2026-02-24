"use client";

import { motion } from "framer-motion";

export default function SEOContent() {
    return (
        <section className="py-20 bg-black border-t border-zinc-900/50">
            <div className="container-width">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl"
                >
                    <h2 className="text-sm font-mono text-zinc-600 uppercase tracking-widest mb-8">
                        About Oryxen Systems
                    </h2>
                    <p className="text-base text-zinc-500 leading-relaxed mb-6">
                        <strong className="text-zinc-400">Oryxen Systems Private Limited</strong> is a{" "}
                        <strong className="text-zinc-400">software development company based in India</strong> specializing in{" "}
                        <strong className="text-zinc-400">custom web development</strong>,{" "}
                        <strong className="text-zinc-400">AI-driven systems</strong>,{" "}
                        <strong className="text-zinc-400">enterprise applications</strong>, and{" "}
                        <strong className="text-zinc-400">scalable full-stack engineering solutions</strong>.
                        We design, architect, and build performance-focused digital platforms tailored for startups and growing
                        businesses worldwide. Our engineering-first approach ensures every product we deliver is optimized for
                        speed, security, and long-term scalability.
                    </p>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        From cloud-native web applications and intelligent automation pipelines to mobile platforms and
                        internal enterprise tooling — Oryxen Systems delivers production-grade software that powers real
                        businesses. Founded by Aditya Choudhury in 2025, the company operates from India and serves clients across
                        the globe, combining deep technical expertise with strategic product thinking.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
