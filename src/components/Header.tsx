"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "#services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || isMobileMenuOpen ? "glass bg-black/85" : "bg-transparent"
      )}
    >
      <div className="container-width">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="group">
            <span className="text-xl font-bold tracking-tight text-white transition-colors">
              Oryxen
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-widest font-mono text-zinc-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Animated CTA Button */}
          <div className="hidden lg:block">
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="#contact"
                className="group inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-widest uppercase text-white border border-zinc-700 hover:border-white hover:bg-white hover:text-black transition-all duration-200 rounded-sm"
              >
                <span>START A PROJECT</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass border-t border-white/[0.1] absolute w-full left-0 top-20 bg-black">
          <nav className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-white/[0.1]">
              <Link
                href="#contact"
                className="block w-full py-3 text-center text-xs font-mono uppercase tracking-widest text-black bg-white rounded-sm hover:bg-zinc-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                START A PROJECT
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}


