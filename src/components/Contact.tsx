"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="py-32 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      {/* Enhanced Animation Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Static grid layer */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#22d3ee08_1px,transparent_1px),linear-gradient(to_bottom,#22d3ee08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />

        {/* Animated flowing grid */}
        <motion.div
          animate={{
            backgroundPosition: ["0px 0px", "40px 40px"],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#22d3ee12_1px,transparent_1px),linear-gradient(to_bottom,#22d3ee12_1px,transparent_1px)] bg-[size:40px_40px] opacity-40"
        />

        {/* Radial glow pulse */}
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(34,211,238,0.08)_0%,transparent_70%)]"
        />
      </div>

      <div className="container-width relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8 leading-[0.9]">
              Ready to ship?
            </h2>
            <p className="text-xl md:text-2xl text-zinc-400 font-light mb-12 tracking-tight">
              From concept to production — without friction.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                href="#collaborate"
                className="bg-white text-black px-8 py-4 text-lg font-bold rounded-md hover:bg-zinc-200 transition-colors inline-flex items-center gap-3 w-fit"
              >
                Start specific project
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#collaborate"
                className="px-8 py-4 text-lg font-medium text-zinc-400 hover:text-white transition-colors border border-zinc-800 rounded-md w-fit"
              >
                Book a consultation
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Enhanced Flow/Pipeline Animation */}
          <div className="relative h-[300px] md:h-[400px] w-full mt-12 lg:mt-0 overflow-hidden">
            {/* Visual Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Scaled container for mobile */}
              <div className="relative w-[500px] h-[400px] flex-none scale-[0.65] sm:scale-75 md:scale-100 origin-center transition-transform">

                {/* Connecting Lines (svg) */}
                <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }} viewBox="0 0 500 400">
                  <title>Pipeline Flow</title>
                  <defs>
                    <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
                      <stop offset="50%" stopColor="rgba(34, 211, 238, 0.5)" />
                      <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
                    </linearGradient>
                    <filter id="particleGlow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Static Paths */}
                  <path d="M50 200 C 150 200, 150 100, 250 100" fill="none" stroke="#333" strokeWidth="2" />
                  <path d="M50 200 C 150 200, 150 300, 250 300" fill="none" stroke="#333" strokeWidth="2" />
                  <path d="M250 100 L 350 100" fill="none" stroke="#333" strokeWidth="2" />
                  <path d="M250 300 L 350 300" fill="none" stroke="#333" strokeWidth="2" />
                  <path d="M350 100 C 400 100, 400 200, 450 200" fill="none" stroke="#333" strokeWidth="2" />
                  <path d="M350 300 C 400 300, 400 200, 450 200" fill="none" stroke="#333" strokeWidth="2" />

                  {/* Animated Particles - Top Path */}
                  <circle r="5" fill="#22d3ee" filter="url(#particleGlow)">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M50 200 C 150 200, 150 100, 250 100 L 350 100 C 400 100, 400 200, 450 200" />
                  </circle>
                  <circle r="3" fill="#22d3ee" opacity="0.6" filter="url(#particleGlow)">
                    <animateMotion dur="2.5s" begin="0.4s" repeatCount="indefinite" path="M50 200 C 150 200, 150 100, 250 100 L 350 100 C 400 100, 400 200, 450 200" />
                  </circle>

                  {/* Animated Particles - Bottom Path */}
                  <circle r="5" fill="#22d3ee" filter="url(#particleGlow)">
                    <animateMotion dur="2.5s" begin="1.25s" repeatCount="indefinite" path="M50 200 C 150 200, 150 300, 250 300 L 350 300 C 400 300, 400 200, 450 200" />
                  </circle>
                  <circle r="3" fill="#22d3ee" opacity="0.6" filter="url(#particleGlow)">
                    <animateMotion dur="2.5s" begin="1.65s" repeatCount="indefinite" path="M50 200 C 150 200, 150 300, 250 300 L 350 300 C 400 300, 400 200, 450 200" />
                  </circle>
                </svg>

                {/* Input Node */}
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute left-[30px] top-[180px] w-10 h-10 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center z-10"
                >
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                </motion.div>

                {/* Processing Node Top */}
                <motion.div
                  animate={{ borderColor: ["rgba(63,63,70,1)", "rgba(34,211,238,0.3)", "rgba(63,63,70,1)"] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute left-[230px] top-[80px] w-12 h-12 bg-zinc-900 border-2 border-zinc-700 rounded-md flex flex-col items-center justify-center z-10"
                >
                  <div className="w-6 h-1 bg-zinc-700 rounded-sm mb-1" />
                  <div className="w-4 h-1 bg-zinc-700 rounded-sm" />
                </motion.div>

                {/* Processing Node Bottom */}
                <motion.div
                  animate={{ borderColor: ["rgba(63,63,70,1)", "rgba(34,211,238,0.3)", "rgba(63,63,70,1)"] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                  className="absolute left-[230px] top-[280px] w-12 h-12 bg-zinc-900 border-2 border-zinc-700 rounded-md flex items-center justify-center z-10"
                >
                  <div className="w-4 h-4 border-2 border-zinc-700 rounded-full" />
                </motion.div>

                {/* Output Node */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 20px rgba(34,211,238,0.1)", "0 0 40px rgba(34,211,238,0.25)", "0 0 20px rgba(34,211,238,0.1)"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute right-[30px] top-[180px] w-14 h-14 bg-zinc-950 border border-cyan-900/50 rounded-lg flex items-center justify-center z-10"
                >
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-3 h-3 bg-cyan-500 rounded-full"
                  />
                </motion.div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
