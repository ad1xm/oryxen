"use client";

import { Shield, Lock, Scale, FileText } from "lucide-react";
import { motion } from "framer-motion";

const legalItems = [
  {
    title: "Ethical AI",
    description: "Systems designed with human oversight and transparency at their core.",
    icon: <Scale className="w-5 h-5" />
  },
  {
    title: "Data Sovereignty",
    description: "Your data remains yours. We implement strict isolation and encryption standards.",
    icon: <Lock className="w-5 h-5" />
  },
  {
    title: "Compliance",
    description: "Adherence to global regulatory frameworks including GDPR and SOC2 standards.",
    icon: <Shield className="w-5 h-5" />
  },
  {
    title: "Transparency",
    description: "Open documentation and clear audit trails for all automated decisions.",
    icon: <FileText className="w-5 h-5" />
  }
];

export default function Legal() {
  return (
    <section className="py-24 bg-black border-t border-zinc-900">
      <div className="container-width grid lg:grid-cols-3 gap-12 lg:gap-24">

        {/* Pillar 1 */}
        <div className="space-y-4">
          <h4 className="text-zinc-200 font-bold text-lg">Ethical Technology</h4>
          <p className="text-zinc-500 leading-relaxed text-sm">
            We design systems with accountability, transparency, and human oversight at their core. ORYXEN does not deploy opaque automation or uncontrolled decision-making software.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="space-y-4">
          <h4 className="text-zinc-200 font-bold text-lg">Privacy by Design</h4>
          <p className="text-zinc-500 leading-relaxed text-sm">
            Privacy is foundational. We implement strict data isolation, encryption standards, and minimal data retention across all systems.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="space-y-4">
          <h4 className="text-zinc-200 font-bold text-lg">Security & Compliance</h4>
          <p className="text-zinc-500 leading-relaxed text-sm">
            Our development practices align with global security standards and modern compliance frameworks across the software lifecycle.
          </p>
        </div>

      </div>
    </section>
  );
}
