"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const deliverables = [
  {
    id: "01",
    title: "Websites & Web Apps",
    description: "High-performance marketing sites and complex web applications using Next.js.",
  },
  {
    id: "02",
    title: "Mobile Applications",
    description: "Native-quality experiences for iOS and Android using React Native.",
  },
  {
    id: "03",
    title: "Desktop Apps (Electron)",
    description: "Cross-platform desktop software that feels native on macOS and Windows.",
  },
  {
    id: "04",
    title: "SaaS Platforms",
    description: "Scalable multi-tenant architectures with subscription payments built-in.",
  },
  {
    id: "05",
    title: "Internal Tools",
    description: "Custom dashboards and admin panels to automate business operations.",
  },
  {
    id: "06",
    title: "AI & Automation",
    description: "Integrating LLMs and intelligent workflows into existing software products.",
  },
  {
    id: "07",
    title: "APIs & Backend",
    description: "Robust, documented, and secure server-side infrastructure.",
  }
];

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [hasStarted, setHasStarted] = useState(false);

  // 1. Visibility Check: Start interaction ONLY when clearly visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Start ONLY when 40% visible and not started yet
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          if (!hasStarted) {
            setHasStarted(true);
            setShouldAutoScroll(true);
            // Ensure first item is centered when we start
            if (itemRefs.current[0]) {
              itemRefs.current[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        } else {
          // Stop auto-scrolling if user scrolls away
          setShouldAutoScroll(false);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [hasStarted]);

  // 2. Infinite Loop (Highlighting starts ONLY after visible)
  useEffect(() => {
    if (!hasStarted) return; // Do not run until visible

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % deliverables.length;
        if (next === 0) {
          setHasScrolledOnce(true);
        }
        return next;
      });
    }, 3500); // Slowed down slightly as requested

    return () => clearInterval(interval);
  }, [hasStarted]);

  // 3. Auto-Scroll Effect (One-time "Story" pass)
  useEffect(() => {
    if (hasScrolledOnce || !shouldAutoScroll) return;

    const currentItem = itemRefs.current[activeIndex];
    if (currentItem) {
      currentItem.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex, hasScrolledOnce, shouldAutoScroll]);

  return (
    <section id="services" ref={containerRef} className="py-24 lg:py-32 bg-zinc-950">
      <div className="container-width">

        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4">Capabilities</h2>
          <h3 className="text-3xl md:text-5xl text-white font-medium tracking-tight max-w-xl leading-tight">
            ORYXEN builds everything required for modern software products.
          </h3>
        </div>

        {/* List Layout - Dividers only */}
        <div className="border-t border-zinc-900">
          {deliverables.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={item.id}
                ref={(el) => {
                  if (el) itemRefs.current[index] = el;
                }}
                className={`group py-8 lg:py-10 border-b border-zinc-900 flex flex-col md:flex-row md:items-start justify-between gap-6 transition-all duration-500 px-4 -mx-4 rounded-sm ${isActive ? 'bg-zinc-900/60' : 'hover:bg-zinc-900/40'}`}
              >
                <div className="flex items-baseline gap-6 md:w-1/3">
                  <span className={`font-mono text-xs transition-colors duration-500 ${isActive ? 'text-zinc-200' : 'text-zinc-600'}`}>{item.id}</span>
                  <h4 className={`text-xl md:text-2xl font-semibold transition-colors duration-500 ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                    {item.title}
                  </h4>
                </div>

                <div className="flex items-center gap-6 md:w-1/2 justify-between">
                  <p className={`transition-colors duration-500 leading-relaxed text-base lg:text-lg max-w-sm ${isActive ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
                    {item.description}
                  </p>
                  <div className={`transition-all duration-500 transform ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                    <ArrowUpRight className={`w-5 h-5 ${isActive ? 'text-zinc-200' : 'text-white'}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
