import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-24">
            <div className="container-width max-w-2xl">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">Privacy</h1>

                <div className="space-y-8 text-lg text-zinc-400 leading-relaxed font-light">
                    <p>
                        Privacy is foundational to how we build software. ORYXEN follows a privacy by design approach, ensuring data is handled only when necessary and protected at every stage of the system lifecycle. We prioritize minimal data collection, secure storage, and controlled access across all applications.
                    </p>
                    <p>
                        We do not build systems that exploit user data or rely on invasive tracking practices. Wherever applicable, we implement industry standard security measures such as encryption, isolation, and role based access to protect sensitive information and maintain user confidence.
                    </p>
                </div>
            </div>
        </main>
    );
}
