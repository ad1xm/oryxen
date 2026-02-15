"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import CodeEditor from "./ui/CodeEditor";

export default function Hero() {
  // Staggered word animation - syncs with code editor timing
  const headlineWords = [
    { text: "We", delay: 0 },
    { text: "build", delay: 0.1 },
  ];

  const headlineWords2 = [
    { text: "digital", delay: 0.2 },
    { text: "systems", delay: 0.3, muted: true },
  ];

  const headlineWords3 = [
    { text: "for", delay: 0.4 },
    { text: "what's", delay: 0.5 },
    { text: "next.", delay: 0.6 },
  ];

  return (
    <section className="relative min-h-screen flex items-center bg-black pt-24 pb-32 overflow-hidden border-b border-zinc-900">

      {/* Subtle Animated Background */}
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 grayscale"
        >
          <source src="/landing page video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      </div>

      <div className="container-width relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Text Content - With synchronized animations */}
          <div className="relative z-20 text-center lg:text-left flex flex-col justify-center pt-8 lg:pt-16">
            <div className="flex flex-col justify-center">

              {/* Animated Headline */}
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-white mb-8 leading-[0.95]">
                {/* Line 1: We build digital */}
                <span className="block">
                  {headlineWords.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.5,
                        delay: word.delay,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      className="inline-block mr-4"
                    >
                      {word.text}
                    </motion.span>
                  ))}
                </span>

                {/* Line 2: systems for */}
                <span className="block">
                  {headlineWords2.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.5,
                        delay: word.delay,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      className={`inline-block mr-4 ${word.muted ? "text-zinc-500" : ""}`}
                    >
                      {word.text}
                    </motion.span>
                  ))}
                </span>

                {/* Line 3: what's next. */}
                <span className="block">
                  {headlineWords3.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.5,
                        delay: word.delay,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      className="inline-block mr-4"
                    >
                      {word.text}
                    </motion.span>
                  ))}
                </span>
              </h1>

              {/* Animated paragraph - fades in after headline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-12 font-light"
              >
                ORYXEN designs and develops websites, applications, platforms, and{" "}
                <motion.span
                  initial={{ color: "rgb(161, 161, 170)" }}
                  animate={{ color: ["rgb(161, 161, 170)", "rgb(34, 211, 238)", "rgb(161, 161, 170)"] }}
                  transition={{ duration: 3, delay: 1.5, repeat: Infinity, repeatDelay: 5 }}
                  className="inline"
                >
                  intelligent software
                </motion.span>{" "}
                for founders and companies worldwide.
              </motion.p>

              {/* Animated buttons - slide in after paragraph */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center sm:items-stretch"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="#contact"
                    className="bg-white text-black px-8 py-3.5 text-sm md:text-base font-bold rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 group min-w-[180px]"
                  >
                    Start a Project
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </Link>
                </motion.div>
                <Link
                  href="#capabilities"
                  className="text-zinc-400 hover:text-white px-8 py-3.5 text-sm md:text-base font-medium transition-all border border-zinc-800 hover:border-zinc-700 rounded-full flex items-center justify-center min-w-[160px] hover:bg-zinc-900/50"
                >
                  View Work
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Visual Content - Live Code Editor */}
          <div className="w-full flex items-center justify-center lg:justify-end pt-8 lg:pt-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-lg"
            >
              <CodeEditor />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
