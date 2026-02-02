"use client";

import { useEffect, useState } from "react";
import { getVisibleTestimonials, Testimonial } from "@/lib/supabase";

// Fallback testimonials in case database is empty or fails
const fallbackTestimonials = [
    { quote: "Clear communication and realistic timelines. The handover was smooth.", name: "Sneha Kulkarni", role: "Product Manager", location: "Pune" },
    { quote: "Code quality was strong. We didn't need to refactor after delivery.", name: "Saurabh Mehta", role: "Tech Lead", location: "Ahmedabad" },
    { quote: "Planning was done keeping future scaling in mind. That helped us avoid rework.", name: "Arjun Patel", role: "SaaS Co-founder", location: "Surat" },
];

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Array<{ quote: string; name: string; role: string; location: string }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTestimonials() {
            try {
                const data = await getVisibleTestimonials();
                if (data && data.length > 0) {
                    setTestimonials(data);
                } else {
                    setTestimonials(fallbackTestimonials);
                }
            } catch (error) {
                console.error('Failed to load testimonials:', error);
                setTestimonials(fallbackTestimonials);
            } finally {
                setLoading(false);
            }
        }
        loadTestimonials();
    }, []);

    // Show minimal content while loading
    if (loading) {
        return (
            <section className="py-24 bg-black border-t border-zinc-900 overflow-hidden">
                <div className="container-width mb-12">
                    <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Client Feedback</h2>
                </div>
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-zinc-700 border-t-cyan-500 rounded-full animate-spin" />
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-black border-t border-zinc-900 overflow-hidden">
            <div className="container-width mb-12">
                <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Client Feedback</h2>
            </div>

            <div className="relative flex w-full overflow-hidden">
                {/* Edge fade gradients */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

                {/* CSS-based marquee for smoother infinite scroll */}
                <div className="flex gap-8 animate-marquee-slow">
                    {[...testimonials, ...testimonials].map((item, i) => (
                        <div
                            key={`testimonial-${i}`}
                            className="w-[400px] flex-shrink-0 p-8 bg-zinc-900/30 border border-zinc-800 rounded-sm whitespace-normal"
                        >
                            <p className="text-zinc-300 leading-relaxed mb-6 text-sm lg:text-base font-light min-h-[80px]">
                                "{item.quote}"
                            </p>
                            <div>
                                <div className="text-white font-medium text-sm">{item.name}</div>
                                <div className="text-zinc-500 text-xs">{item.role}, {item.location}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
