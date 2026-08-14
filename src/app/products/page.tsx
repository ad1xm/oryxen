import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    alternates: {
        canonical: "/products",
    },
    title: "Products | Oryxen Systems Private Limited – Software Products Built in India",
    description:
        "Explore products built by Oryxen Systems Private Limited. EdgeLightWind, a lightweight Windows desktop utility for video calls and streaming. Built with engineering excellence in India.",
    openGraph: {
        title: "Products by Oryxen Systems Private Limited",
        description:
            "Software products built by Oryxen Systems – EdgeLightWind and more.",
        type: "website",
    },
};

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="border-b border-zinc-900">
                <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold tracking-tight">
                        ORYXEN
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <Link href="/about" className="hover:text-white transition-colors">About</Link>
                        <Link href="/products" className="text-white">Products</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </nav>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-20">
                {/* Page Heading */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    Our Products
                </h1>
                <p className="text-xl text-zinc-400 mb-16 max-w-2xl leading-relaxed">
                    Software products built by Oryxen Systems Private Limited: engineered for performance, designed for purpose.
                </p>

                {/* EdgeLightWind */}
                <section className="mb-20">
                    <div className="p-8 md:p-12 border border-zinc-800/50 rounded-2xl bg-zinc-900/20">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-zinc-800/50 rounded-xl border border-zinc-700/50 flex items-center justify-center">
                                <img src="/edgelightwind.svg" alt="EdgeLightWind" className="w-10 h-10 object-contain" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white">EdgeLightWind</h2>
                                <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Desktop Utility</span>
                            </div>
                        </div>

                        <div className="space-y-4 text-zinc-400 leading-relaxed mb-8">
                            <p className="text-lg">
                                A lightweight Windows desktop utility that creates a professional ring light style border around your
                                screen for video calls, streaming, and content creation.
                            </p>
                            <p>
                                Built with Electron, EdgeLightWind sits quietly in your system tray and activates with a single click.
                                Perfect for professionals who want to look their best on camera without expensive hardware.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4 mb-8">
                            {[
                                { label: "Use Case", items: ["Video meetings", "Live streaming", "Content recording"] },
                                { label: "Platform", items: ["Windows 10+", "Built with Electron", "Lightweight ~15MB"] },
                                { label: "Features", items: ["System tray integration", "Customizable colors", "Hotkey support"] },
                            ].map((group) => (
                                <div key={group.label} className="p-4 bg-zinc-800/20 rounded-lg border border-zinc-800/30">
                                    <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">{group.label}</h3>
                                    <ul className="space-y-2">
                                        {group.items.map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <a
                                href="https://remarkable-crumble-3ab060.netlify.app/downloads/EdgeLightWind%201.0.zip"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors"
                            >
                                <img src="/windows.svg" alt="Windows" className="w-5 h-5" />
                                <span>Download for Windows</span>
                            </a>
                            <div className="flex items-center gap-3 text-xs text-zinc-600 px-2">
                                <div className="text-right border-r border-zinc-800 pr-3">
                                    <div className="font-medium text-zinc-500">VERSION</div>
                                    <div>1.0</div>
                                </div>
                                <div>
                                    <div className="font-medium text-zinc-500">PLATFORM</div>
                                    <div>Windows (Electron)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* More Products Coming */}
                <section className="mb-16">
                    <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">
                        Coming Soon
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 border border-dashed border-zinc-800/50 rounded-lg">
                            <h3 className="text-lg font-semibold text-zinc-500 mb-2">More tools in development</h3>
                            <p className="text-sm text-zinc-600">
                                We&apos;re building more developer and productivity tools. Stay tuned for announcements.
                            </p>
                        </div>
                        <div className="p-6 border border-dashed border-zinc-800/50 rounded-lg">
                            <h3 className="text-lg font-semibold text-zinc-500 mb-2">Custom solutions</h3>
                            <p className="text-sm text-zinc-600">
                                Need a custom product built? Oryxen Systems builds bespoke software solutions for organizations globally.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="pt-12 border-t border-zinc-800">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Want to build a product together?</h2>
                    <p className="text-zinc-400 mb-8">
                        We partner with founders and organizations to build production-grade software products.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="/contact"
                            className="bg-white text-black px-8 py-3.5 text-sm font-bold rounded-full hover:bg-zinc-200 transition-colors"
                        >
                            Contact Us
                        </Link>
                        <Link
                            href="/"
                            className="text-zinc-400 hover:text-white px-8 py-3.5 text-sm font-medium transition-colors border border-zinc-800 hover:border-zinc-700 rounded-full"
                        >
                            Back to Home
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
