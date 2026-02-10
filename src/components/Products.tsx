"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function Products() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="products" ref={sectionRef} className="py-32 bg-zinc-950 border-b border-zinc-900 overflow-hidden">
      <div className="container-width">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                [ ENGINEERING ]
              </span>
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We build with you. <br />
              <span className="text-zinc-500">We build for us.</span>
            </motion.h2>
            <motion.p
              className="text-zinc-400 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Partner projects merge with our internal tools.
              Every line of code strengthens the entire ecosystem.
            </motion.p>
          </motion.div>

          {/* Premium Abstract Animation */}
          <motion.div
            className="relative w-full aspect-square max-w-[500px] mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {mounted && <AbstractCoreAnimation isInView={isInView} />}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function AbstractCoreAnimation({ isInView }: { isInView: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">

      {/* Outer orbit rings */}
      <motion.div
        className="absolute w-[95%] h-[95%] rounded-full"
        style={{ border: "1px solid rgba(255,255,255,0.03)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[80%] h-[80%] rounded-full"
        style={{ border: "1px solid rgba(255,255,255,0.05)" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[65%] h-[65%] rounded-full"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Orbiting nodes on outer ring */}
      <motion.div
        className="absolute w-[95%] h-[95%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-3 h-3 bg-white rounded-full"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <motion.div
            className="w-2 h-2 bg-white/60 rounded-full"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Middle orbiting elements */}
      <motion.div
        className="absolute w-[65%] h-[65%]"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-4 h-4 border border-white/40 rounded-sm rotate-45"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </div>
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-2.5 h-2.5 bg-white/50 rounded-full"
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </div>
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-3 h-3 border border-white/30 rounded-full"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Center structure */}
      <div className="relative">
        {/* Outer glow */}
        <motion.div
          className="absolute -inset-16 bg-white/[0.02] rounded-full blur-3xl"
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Main hexagonal core */}
        <motion.div
          className="relative w-32 h-32 md:w-40 md:h-40"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
              </linearGradient>
              <filter id="coreGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Hexagon fill */}
            <motion.polygon
              points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
              fill="url(#coreGradient)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
            />

            {/* Inner hexagon */}
            <motion.polygon
              points="50,20 75,35 75,65 50,80 25,65 25,35"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.8 }}
            />

            {/* Core dot */}
            <motion.circle
              cx="50" cy="50" r="6"
              fill="white"
              filter="url(#coreGlow)"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.2 }}
            />

            {/* Connector lines from center */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.line
                key={i}
                x1="50" y1="50"
                x2={50 + 35 * Math.cos((angle - 90) * Math.PI / 180)}
                y2={50 + 35 * Math.sin((angle - 90) * Math.PI / 180)}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
              />
            ))}
          </svg>

          {/* Scanning line effect */}
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-xl"
            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>

        {/* Corner brackets */}
        <div className="absolute -top-6 -left-6 w-6 h-6 border-l border-t border-white/20" />
        <div className="absolute -top-6 -right-6 w-6 h-6 border-r border-t border-white/20" />
        <div className="absolute -bottom-6 -left-6 w-6 h-6 border-l border-b border-white/20" />
        <div className="absolute -bottom-6 -right-6 w-6 h-6 border-r border-b border-white/20" />
      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45) * Math.PI / 180;
        const radius = 42 + (i % 2) * 5;
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${50 + radius * Math.cos(angle)}%`,
              top: `${50 + radius * Math.sin(angle)}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.25,
            }}
          />
        );
      })}

      {/* Connection dots at edges */}
      <motion.div
        className="absolute top-4 right-8"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-1.5 h-1.5 bg-white rounded-full" />
      </motion.div>
      <motion.div
        className="absolute bottom-8 left-4"
        animate={{ opacity: [0.2, 0.7, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      >
        <div className="w-1 h-1 bg-white/60 rounded-full" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 left-2"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 1 }}
      >
        <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
      </motion.div>

      {/* EdgeLightWind Section */}
      <motion.div
        className="container-width mt-32"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
          <div className="grid lg:grid-cols-2 gap-12 p-8 md:p-12 lg:p-16 items-center">

            {/* Content Side */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <img src="/edgelightwind.svg" alt="EdgeLightWind Logo" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white tracking-tight">EdgeLightWind</h3>
                  <div className="flex items-center gap-3 text-sm text-zinc-400 mt-1">
                    <span className="bg-zinc-800/50 px-2 py-0.5 rounded-md border border-zinc-700/50">v1.0</span>
                    <span>Windows (Electron)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-zinc-300 leading-relaxed">
                  A lightweight Windows desktop utility that creates a professional
                  ring-light style border around your screen for video calls, streaming,
                  and content creation.
                </p>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">What it does</h4>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {[
                      "Video meetings",
                      "Live streaming",
                      "Content recording",
                      "Face illumination"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="https://remarkable-crumble-3ab060.netlify.app/downloads/edgelightwind-download.zip"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors group"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.451l-9.75.043v-8.144zm10.93 2.062l9.645-1.353v9.805l-9.645.023V5.511zm-10.93 7.502l9.75.041v8.117l-9.75-1.34v-6.818zm10.93.136l9.645.025v6.626l-9.645-1.378V13.149z" />
                  </svg>
                  <span>Download for Windows 64-bit</span>
                </a>
                <p className="mt-3 text-sm text-zinc-600">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                  Secure direct download
                </p>
              </div>
            </div>

            {/* Visual Side */}
            <div className="relative h-full min-h-[400px] rounded-2xl bg-zinc-950/50 border border-zinc-800/50 overflow-hidden flex items-center justify-center p-8 group">
              {/* Screen Mockup */}
              <div className="relative w-full max-w-[400px] aspect-video bg-zinc-900 rounded-lg border border-zinc-700 shadow-2xl overflow-hidden">
                {/* The "Light" Border Effect */}
                <div className="absolute inset-0 border-[8px] border-white/90 shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] z-20 rounded-lg" />

                {/* Mock Content */}
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-zinc-700 rounded-full mx-auto mb-3" />
                    <div className="w-24 h-3 bg-zinc-700 rounded mx-auto" />
                  </div>
                </div>

                {/* UI Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-10">
                  <div className="w-8 h-8 bg-zinc-700/50 rounded-full backdrop-blur-sm" />
                  <div className="w-8 h-8 bg-red-500/80 rounded-full backdrop-blur-sm" />
                  <div className="w-8 h-8 bg-zinc-700/50 rounded-full backdrop-blur-sm" />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
