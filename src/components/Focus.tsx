"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const pillars = [
  {
    id: "01",
    title: "Precision",
    description: "Code is not just functionality; it is structure. We architect systems with mathematical exactness, eliminating redundancy and maximizing efficiency."
  },
  {
    id: "02",
    title: "Velocity",
    description: "Speed is a feature. We build infrastructure that allows your team to ship faster, safely. No bottlenecks, just momentum."
  },
  {
    id: "03",
    title: "Resilience",
    description: "Systems must survive success. We architect for scale from day one, ensuring stability under the pressure of millions of users."
  }
];

export default function Focus() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="focus" ref={sectionRef} className="py-32 bg-zinc-950 border-b border-zinc-900 overflow-hidden">
      <div className="container-width">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {/* Large Sculptural Number with enhanced hover */}
              <motion.div
                className="text-[12rem] font-bold text-zinc-900/50 leading-none absolute -top-24 -left-6 select-none pointer-events-none transition-colors duration-500 group-hover:text-zinc-800"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
              >
                {pillar.id}
              </motion.div>

              <motion.div
                className="relative z-10 pt-16 pl-6 border-l border-zinc-800 group-hover:border-zinc-600 transition-colors duration-300 h-full"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
              >
                {/* Accent line that grows on scroll */}
                <motion.div
                  className="absolute left-0 top-16 w-[2px] bg-cyan-500/50"
                  initial={{ height: 0 }}
                  animate={isInView ? { height: "40px" } : {}}
                  transition={{ duration: 0.8, delay: index * 0.15 + 0.5 }}
                />

                <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-cyan-50 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-lg font-light group-hover:text-zinc-300 transition-colors">
                  {pillar.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
