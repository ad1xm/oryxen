import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    alternates: {
        canonical: "/about",
    },
    title: "About Us | Oryxen Systems Private Limited – Software Engineering Company in India",
    description:
        "Learn about Oryxen Systems Private Limited — a software development company based in India. We specialize in custom web development, AI-driven systems, full-stack engineering, and enterprise applications. Founded by Aditya Choudhury.",
    openGraph: {
        title: "About Oryxen Systems Private Limited",
        description:
            "Software development company in India. Custom web development, AI-driven systems, enterprise applications.",
        type: "website",
    },
};

export default function AboutPage() {
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
                        <Link href="/about" className="text-white">About</Link>
                        <Link href="/products" className="hover:text-white transition-colors">Products</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </nav>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-20">
                {/* Page Heading */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    About Oryxen Systems Private Limited
                </h1>
                <p className="text-xl text-zinc-400 mb-16 max-w-2xl leading-relaxed">
                    A software engineering company based in India, building digital products with precision and purpose.
                </p>

                {/* Company Overview */}
                <section className="mb-16">
                    <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">
                        Company Overview
                    </h2>
                    <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
                        <p>
                            <strong className="text-white">Oryxen Systems Private Limited</strong> is a{" "}
                            <strong className="text-zinc-200">software development company</strong> that designs, builds, and scales
                            digital products for founders, startups, and organizations. We specialize in{" "}
                            <strong className="text-zinc-200">custom web development</strong>,{" "}
                            <strong className="text-zinc-200">AI-driven systems</strong>,{" "}
                            <strong className="text-zinc-200">full-stack engineering</strong>, and{" "}
                            <strong className="text-zinc-200">enterprise applications</strong>.
                        </p>
                        <p>
                            Founded in 2025, we are a product-first engineering studio. We reject bloated software and instead focus on
                            system architecture, data integrity, and user experience. Every product we build is engineered to perform at
                            scale — from day one.
                        </p>
                        <p>
                            <strong className="text-zinc-200">Based in India, serving clients globally.</strong> Our engineering team
                            works with clients across industries including fintech, e-commerce, SaaS, education, and healthcare.
                        </p>
                    </div>
                </section>

                {/* Services / What We Do */}
                <section className="mb-16">
                    <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">
                        What We Do
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                title: "Custom Web Development",
                                description:
                                    "Production-grade web applications built with modern frameworks — Next.js, React, Node.js, and cloud-native architectures.",
                            },
                            {
                                title: "AI-Driven Systems",
                                description:
                                    "Intelligent software with AI/ML integration — from natural language processing to predictive analytics and automation pipelines.",
                            },
                            {
                                title: "Full-Stack Engineering",
                                description:
                                    "End-to-end development from frontend interfaces to backend APIs, databases, and cloud infrastructure.",
                            },
                            {
                                title: "Enterprise Applications",
                                description:
                                    "Scalable, secure systems for organizations — CRMs, ERPs, admin dashboards, and internal tooling.",
                            },
                            {
                                title: "Mobile Applications",
                                description:
                                    "Cross-platform and native mobile apps built for performance, reliability, and exceptional user experience.",
                            },
                            {
                                title: "Automation Solutions",
                                description:
                                    "Workflow automation, CI/CD pipelines, data processing systems, and intelligent business process automation.",
                            },
                        ].map((service) => (
                            <div
                                key={service.title}
                                className="p-6 border border-zinc-800/50 rounded-lg bg-zinc-900/20 hover:border-zinc-700/50 transition-colors"
                            >
                                <h3 className="text-lg font-semibold text-white mb-3">{service.title}</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Founder */}
                <section className="mb-16">
                    <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">
                        Founder
                    </h2>

                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "Person",
                                "@id": "https://oryxen.co.in/#founder",
                                "name": "Aditya Choudhury",
                                "jobTitle": "Founder",
                                "worksFor": {
                                    "@id": "https://oryxen.co.in/#organization"
                                },
                                "url": "https://oryxen.co.in/about",
                                "sameAs": [
                                    "https://github.com/syncwithadi",
                                    "https://linkedin.com/in/adityabuilds"
                                ]
                            })
                        }}
                    />

                    <div className="p-8 border border-zinc-800/50 rounded-lg bg-zinc-900/20">
                        <h3 className="text-2xl font-bold text-white mb-2">Aditya Choudhury</h3>
                        <p className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-4">
                            Founder of Oryxen Systems Private Limited
                        </p>
                        <p className="text-zinc-400 leading-relaxed max-w-2xl mb-6">
                            Aditya Choudhury founded Oryxen Systems with a clear engineering-first directive. Specializing in system architecture, performant full-stack development, and data integrity, he leads the technical vision to build scalable, resilient digital products. Based in India.
                        </p>
                        <ul className="flex flex-wrap gap-4 text-sm font-mono text-zinc-400">
                            <li>
                                <a href="https://github.com/syncwithadi" target="_blank" rel="me noopener noreferrer" className="hover:text-white transition-colors border-b border-zinc-700 hover:border-white pb-0.5">
                                    GitHub → syncwithadi
                                </a>
                            </li>
                            <li>
                                <a href="https://linkedin.com/in/adityabuilds" target="_blank" rel="me noopener noreferrer" className="hover:text-white transition-colors border-b border-zinc-700 hover:border-white pb-0.5">
                                    LinkedIn → adityabuilds
                                </a>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Location */}
                <section className="mb-16">
                    <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">
                        Location
                    </h2>
                    <div className="text-zinc-400 space-y-2">
                        <p className="text-lg">
                            <strong className="text-white">Oryxen Systems Private Limited</strong>
                        </p>
                        <p>India</p>
                        <p className="text-zinc-500 text-sm mt-4">
                            Based in India · Serving clients globally
                        </p>
                    </div>
                </section>

                {/* Connect */}
                <section className="mb-16">
                    <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">
                        Connect With Us
                    </h2>
                    <div className="flex flex-wrap gap-6 text-zinc-400">
                        <a href="https://github.com/syncwithadi" className="hover:text-white transition-colors" target="_blank" rel="me noopener noreferrer">
                            GitHub
                        </a>
                        <a href="https://twitter.com/oryxenhq" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                            Twitter
                        </a>
                        <a href="https://linkedin.com/in/adityabuilds" className="hover:text-white transition-colors" target="_blank" rel="me noopener noreferrer">
                            LinkedIn
                        </a>
                    </div>
                </section>

                {/* CTA */}
                <section className="pt-12 border-t border-zinc-800">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to build?</h2>
                    <p className="text-zinc-400 mb-8">
                        Let&apos;s discuss your project. From concept to production — without friction.
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
