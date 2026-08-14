"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between bg-black overflow-hidden border-b border-zinc-900 pt-24 pb-12 lg:pt-32 lg:pb-16">
      {/* Background Image & Editorial Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/new background.webp"
          alt="Landing Background"
          fill
          priority
          className="object-cover opacity-85 brightness-90"
        />
        {/* Editorial dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
      </div>

      {/* Main Center Headline: Rise above. See beyond. */}
      <div className="container-width relative z-10 my-auto py-8 lg:py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(1.75rem,5.2vw,5.2rem)] font-extrabold tracking-tight font-sans select-none whitespace-nowrap leading-none"
        >
          <span className="text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
            Rise above.{" "}
          </span>
          <span className="text-transparent [-webkit-text-stroke:1.2px_rgba(255,255,255,0.85)] [text-stroke:1.2px_rgba(255,255,255,0.85)] font-normal">
            See beyond.
          </span>
        </motion.h1>
      </div>

      {/* Bottom Content: Subtext + Premium Animated GET STARTED Button on Left, Diagonal Vector Accent on Right */}
      <div className="container-width relative z-10 w-full flex flex-col md:flex-row items-end justify-between gap-8">
        {/* Left Side: Requested Subtext & Premium GET STARTED Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md text-left"
        >
          <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed mb-6 font-sans drop-shadow-md">
            Oryxen engineers products that feel inevitable, combining strategy, design, and technology into systems built for global growth.
          </p>

          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="inline-block"
          >
            <Link
              href="#contact"
              className="group inline-flex items-center gap-2.5 bg-white text-black font-bold text-xs tracking-[0.18em] uppercase px-7 py-3.5 rounded-sm hover:bg-zinc-200 transition-colors duration-200 shadow-md"
            >
              <span>GET STARTED</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-black/80 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side: Diagonal Parallel Accent Lines Vector */}
        <div className="hidden sm:block pointer-events-none opacity-40">
          <svg
            className="w-48 h-28 text-white/30"
            viewBox="0 0 200 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <line x1="120" y1="120" x2="200" y2="40" />
            <line x1="100" y1="120" x2="200" y2="20" />
            <line x1="80" y1="120" x2="200" y2="0" />
            <line x1="60" y1="120" x2="180" y2="0" />
            <line x1="40" y1="120" x2="160" y2="0" />
          </svg>
        </div>
      </div>
    </section>
  );
}






