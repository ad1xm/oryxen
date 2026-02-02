"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black pt-20 pb-10 border-t border-zinc-900">
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
              © 2025 ORYXEN SYSTEMS <br />
              A studio shaped by A. Choudhury
            </p>
          </div>

          {/* Sitemaps */}
          <div className="flex gap-16 md:gap-24">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Index</h3>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><Link href="#about" className="hover:text-white transition-colors">Manifesto</Link></li>
                <li><Link href="#services" className="hover:text-white transition-colors">Capabilities</Link></li>
                <li><Link href="#products" className="hover:text-white transition-colors">Infrastructure</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Socials</h3>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><Link href="https://github.com/oryxen" className="hover:text-white transition-colors">GitHub</Link></li>
                <li><Link href="https://twitter.com/oryxen" className="hover:text-white transition-colors">Twitter</Link></li>
                <li><Link href="https://linkedin.com/company/oryxen" className="hover:text-white transition-colors">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-700 font-mono">
          <p>© 2025 ORYXEN SYSTEMS.</p>
          <div className="flex gap-6">
            <Link href="/ethics" className="hover:text-zinc-500 transition-colors uppercase">ETHICS</Link>
            <Link href="/privacy" className="hover:text-zinc-500 transition-colors uppercase">PRIVACY</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
