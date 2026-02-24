import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export const metadata = {
    title: "Engineering Blog | Oryxen",
    description: "Insights on AI development, full-stack engineering, SaaS architecture, and strategic hiring.",
    alternates: { canonical: "https://oryxen.co.in/blog" }
};

export default function BlogPage() {
    const posts = [
        {
            title: "Best Programming Languages for Hiring Developers in 2026",
            excerpt: "Complete guide to hiring developers in 2026. Compare Python, TypeScript, Go, and more. Understand market demand, salary ranges, talent pool analysis, and strategic hiring insights.",
            slug: "best-programming-languages-to-hire-developers-2026",
            date: "Feb 25, 2026",
            readTime: "12 min read",
            category: "Engineering Strategy",
        }
    ];

    return (
        <div className="bg-black min-h-screen pt-32 pb-20 text-white selection:bg-white/20">
            <div className="container-width px-4 sm:px-6">
                {/* Header Section */}
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-[family-name:var(--font-playfair)] font-semibold tracking-tight text-white mb-6 leading-tight">
                        Insights &amp; Engineering Blog
                    </h1>
                    <p className="text-lg text-zinc-400 font-[family-name:var(--font-sora)] font-normal leading-relaxed max-w-2xl">
                        Thoughts, strategies, and technical deep dives on AI development, SaaS architecture, enterprise engineering, and building high-performing tech teams.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col glass p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.02]"
                        >
                            <div className="flex items-center gap-3 text-xs font-semibold tracking-wider text-indigo-400 uppercase mb-4 font-[family-name:var(--font-sora)]">
                                {post.category}
                            </div>

                            <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)] mb-4 text-white group-hover:text-zinc-200 transition-colors">
                                {post.title}
                            </h2>

                            <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-grow font-[family-name:var(--font-sora)]">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between text-xs text-zinc-500 font-[family-name:var(--font-sora)] mt-auto pt-6 border-t border-white/10 group-hover:border-white/20 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
