"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Zap, Users } from "lucide-react";
import { StatItem } from "./ui/StatItem";
import { getStats, Stat } from "@/lib/supabase";

// Fallback stats in case database is empty or fails
const fallbackStats = [
  { value: "2025", label: "Founded", icon: <TrendingUp className="w-5 h-5" /> },
  { value: "7+", label: "Active Projects", icon: <Zap className="w-5 h-5" /> },
  { value: "100%", label: "Engineering Led", icon: <Users className="w-5 h-5" /> },
];

// Icon mapping for dynamic stats
const iconMap: Record<string, React.ReactNode> = {
  "Founded": <TrendingUp className="w-5 h-5" />,
  "Active Projects": <Zap className="w-5 h-5" />,
  "Engineering Led": <Users className="w-5 h-5" />,
  "Projects": <Zap className="w-5 h-5" />,
  "Clients": <Users className="w-5 h-5" />,
};

import { motion } from "framer-motion";

function ManifestoBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Architectural Grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Animated Scanning Line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-30"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Tech Particles */}
      <Particles />
    </div>
  );
}

function Particles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  );
}

export default function About() {
  const [stats, setStats] = useState<Array<{ value: string; label: string; icon: React.ReactNode }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getStats();
        if (data && data.length > 0) {
          setStats(data.map(s => ({
            value: s.value,
            label: s.label,
            icon: iconMap[s.label] || <Zap className="w-5 h-5" />
          })));
        } else {
          setStats(fallbackStats);
        }
      } catch (error) {
        console.error('Failed to load stats:', error instanceof Error ? error.message : JSON.stringify(error));
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <section id="about" className="py-24 lg:py-32 relative overflow-hidden bg-black">
      <ManifestoBackground />
      <div className="container-width relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Manifesto Copy */}
          <div className="space-y-8">
            <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">Manifesto</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
              We reject the bloat of modern software.
            </h3>
            <div className="space-y-6 text-lg text-zinc-400 font-light leading-relaxed">
              <p>
                Most digital products are over-designed and under-optimized. They look good in Figma but fall apart in production.
              </p>
              <p>
                Oryxen is different. We are a product-first studio. We prioritize system architecture, data integrity, and user experience over decorative fluff. We build software that works.
              </p>
            </div>

            {/* SEO Structured Keyword Block */}
            <div className="pt-6 border-t border-zinc-800/50 space-y-4">
              <h4 className="text-xs font-mono text-zinc-600 uppercase tracking-widest">What We Do</h4>
              <p className="text-base text-zinc-500 leading-relaxed">
                Oryxen Systems Private Limited is a <strong className="text-zinc-300">software development company</strong> specializing in{" "}
                <strong className="text-zinc-300">custom web development</strong>,{" "}
                <strong className="text-zinc-300">AI-driven systems</strong>,{" "}
                <strong className="text-zinc-300">full-stack engineering</strong>, and{" "}
                <strong className="text-zinc-300">enterprise applications</strong>.
                We deliver end-to-end software engineering solutions — from system architecture and cloud infrastructure to production-grade application deployment.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Based in India, serving clients globally. We combine deep engineering expertise with strategic product thinking to build systems that scale.
              </p>
            </div>
          </div>

          {/* Architectural Stats */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-16 pt-8 lg:pt-0">
            {loading ? (
              <div className="col-span-2 flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-zinc-700 border-t-cyan-500 rounded-full animate-spin" />
              </div>
            ) : (
              stats.map((stat, i) => (
                <StatItem key={stat.label} stat={stat} index={i} />
              ))
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
