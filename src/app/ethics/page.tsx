import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

export default function EthicsPage() {
    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-24 relative">
            <Link href="/" className="fixed top-6 right-6 md:top-10 md:right-10 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all z-50">
                <X className="w-5 h-5" />
            </Link>
            <div className="container-width max-w-2xl">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">Ethics</h1>

                <div className="space-y-8 text-lg text-zinc-400 leading-relaxed font-light">
                    <p>
                        At ORYXEN, we approach technology with responsibility and restraint. Every system we build is designed with clear intent, transparency, and human oversight. We avoid opaque automation, misleading patterns, or implementations that compromise user trust for short term gains.
                    </p>
                    <p>
                        We believe software should solve real problems without introducing hidden risks. Decisions around architecture, automation, and intelligence are made carefully, keeping long term impact in mind. Ethical use of technology is not an afterthought for us, it is part of the design process itself.
                    </p>
                </div>
            </div>
        </main>
    );
}
