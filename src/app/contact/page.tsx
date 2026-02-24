import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    alternates: {
        canonical: "/contact",
    },
    title: "Contact Us | Oryxen Systems Private Limited – Get in Touch",
    description:
        "Contact Oryxen Systems Private Limited — a software development company based in India. Reach out for custom web development, AI-driven systems, enterprise applications, and full-stack engineering projects.",
    openGraph: {
        title: "Contact Oryxen Systems Private Limited",
        description:
            "Get in touch with Oryxen Systems for software development, AI-driven systems, and enterprise applications.",
        type: "website",
    },
};

export default function ContactPage() {
    const contactSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Oryxen Systems Private Limited",
        "url": "https://oryxen.co.in/contact",
        "mainEntity": {
            "@type": ["Organization", "Corporation"],
            "@id": "https://oryxen.co.in/#organization",
            "name": "Oryxen Systems Private Limited",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN",
                "addressLocality": "India",
            },
            "founder": {
                "@id": "https://oryxen.co.in/#founder"
            },
        },
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
            />

            {/* Header */}
            <header className="border-b border-zinc-900">
                <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold tracking-tight">
                        ORYXEN
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <Link href="/about" className="hover:text-white transition-colors">About</Link>
                        <Link href="/products" className="hover:text-white transition-colors">Products</Link>
                        <Link href="/contact" className="text-white">Contact</Link>
                    </nav>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-20">
                {/* Page Heading */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    Contact Oryxen Systems
                </h1>
                <p className="text-xl text-zinc-400 mb-16 max-w-2xl leading-relaxed">
                    Ready to start a project? Let&apos;s discuss your requirements. From concept to production — without friction.
                </p>

                <div className="grid md:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        {/* Company Info */}
                        <div>
                            <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">
                                Company
                            </h2>
                            <div className="space-y-3 text-zinc-400">
                                <p className="text-xl text-white font-semibold">Oryxen Systems Private Limited</p>
                                <p>Software Development Company</p>
                                <p className="text-zinc-500">Based in India · Serving clients globally</p>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">
                                Location
                            </h2>
                            <div className="space-y-2 text-zinc-400">
                                <p>India</p>
                                <p className="text-sm text-zinc-600 mt-3">
                                    We work with clients remotely and on-site across India and internationally.
                                </p>
                            </div>
                        </div>

                        {/* Founder */}
                        <div>
                            <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">
                                Leadership
                            </h2>
                            <div className="space-y-2 text-zinc-400">
                                <p className="text-white font-medium">Aditya Choudhury</p>
                                <p className="text-sm text-zinc-500">Founder &amp; Lead Engineer</p>
                            </div>
                        </div>

                        {/* Socials */}
                        <div>
                            <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">
                                Connect
                            </h2>
                            <ul className="space-y-3 text-zinc-400">
                                <li>
                                    <a href="https://github.com/syncwithadi" className="hover:text-white transition-colors" target="_blank" rel="me noopener noreferrer">
                                        GitHub → syncwithadi
                                    </a>
                                </li>
                                <li>
                                    <a href="https://twitter.com/oryxenhq" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                                        Twitter → @oryxenhq
                                    </a>
                                </li>
                                <li>
                                    <a href="https://linkedin.com/in/adityabuilds" className="hover:text-white transition-colors" target="_blank" rel="me noopener noreferrer">
                                        LinkedIn → adityabuilds
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Services Summary */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6">
                                What We Can Help With
                            </h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        title: "Custom Web Development",
                                        description: "Modern web applications built with Next.js, React, and cloud-native architectures.",
                                    },
                                    {
                                        title: "AI-Driven Systems",
                                        description: "Intelligent software with AI/ML integration, NLP, and automation pipelines.",
                                    },
                                    {
                                        title: "Full-Stack Engineering",
                                        description: "End-to-end development — frontend, backend, APIs, databases, and infrastructure.",
                                    },
                                    {
                                        title: "Enterprise Applications",
                                        description: "Scalable systems for organizations — CRMs, ERPs, dashboards, and internal tools.",
                                    },
                                    {
                                        title: "Mobile Applications",
                                        description: "Cross-platform and native mobile apps built for performance and reliability.",
                                    },
                                ].map((service) => (
                                    <div
                                        key={service.title}
                                        className="p-5 border border-zinc-800/50 rounded-lg bg-zinc-900/20 hover:border-zinc-700/50 transition-colors"
                                    >
                                        <h3 className="text-base font-semibold text-white mb-1">{service.title}</h3>
                                        <p className="text-sm text-zinc-500">{service.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="pt-8 border-t border-zinc-800/50">
                            <h3 className="text-xl font-bold mb-4">Start a Project</h3>
                            <p className="text-zinc-400 text-sm mb-6">
                                Tell us about your project requirements. We respond within 24 hours.
                            </p>
                            <Link
                                href="/#collaborate"
                                className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 text-sm font-bold rounded-full hover:bg-zinc-200 transition-colors"
                            >
                                Submit Project Brief
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
