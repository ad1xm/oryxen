"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const [activeModal, setActiveModal] = useState<"ethics" | "privacy" | null>(null);

  return (
    <footer id="footer" className="bg-black pt-20 pb-10 border-t border-zinc-900">
      <div className="container-width">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">

          {/* Brand */}
          <div className="space-y-6 max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <span className="text-xl font-bold tracking-tighter text-white">
                ORYXEN
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed font-mono">
              © 2026 Oryxen Systems Private Limited <br />
              A studio shaped by Aditya Choudhury
            </p>
            <p className="text-xs text-zinc-600">
              Based in India · Serving clients globally
            </p>
          </div>

          {/* Sitemaps */}
          <div className="flex gap-16 md:gap-24">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Index</h3>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Socials</h3>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="https://github.com/syncwithadi" target="_blank" rel="me noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                <li><Link href="https://twitter.com/oryxenhq" className="hover:text-white transition-colors">Twitter</Link></li>
                <li><a href="https://linkedin.com/in/adityabuilds" target="_blank" rel="me noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-700 font-mono">
          <p>© 2026 Oryxen Systems Private Limited.</p>
          <div className="flex gap-6">
            <button
              onClick={() => setActiveModal("ethics")}
              className="hover:text-white transition-colors uppercase cursor-pointer"
            >
              ETHICS
            </button>
            <button
              onClick={() => setActiveModal("privacy")}
              className="hover:text-white transition-colors uppercase cursor-pointer"
            >
              PRIVACY
            </button>
          </div>
        </div>
      </div>

      {/* Instant Modal Overlay */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-2xl text-white my-auto max-h-[85vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Back Button inside Modal */}
              <button
                onClick={() => setActiveModal(null)}
                className="inline-flex items-center text-xs font-mono text-zinc-500 hover:text-white transition-colors mb-8 group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Close
              </button>

              {activeModal === "ethics" && (
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-6">Ethics</h2>
                  <div className="space-y-6 text-base text-zinc-400 leading-relaxed font-light">
                    <p>
                      At ORYXEN, we approach technology with responsibility and restraint. Every system we build is designed with clear intent, transparency, and human oversight. We avoid opaque automation, misleading patterns, or implementations that compromise user trust for short term gains.
                    </p>
                    <p>
                      We believe software should solve real problems without introducing hidden risks. Decisions around architecture, automation, and intelligence are made carefully, keeping long term impact in mind. Ethical use of technology is not an afterthought for us, it is part of the design process itself.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === "privacy" && (
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-6">Privacy</h2>
                  <div className="space-y-6 text-base text-zinc-400 leading-relaxed font-light">
                    <p>
                      Privacy is foundational to how we build software. ORYXEN follows a privacy by design approach, ensuring data is handled only when necessary and protected at every stage of the system lifecycle. We prioritize minimal data collection, secure storage, and controlled access across all applications.
                    </p>
                    <p>
                      We do not build systems that exploit user data or rely on invasive tracking practices. Wherever applicable, we implement industry standard security measures such as encryption, isolation, and role based access to protect sensitive information and maintain user confidence.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}

