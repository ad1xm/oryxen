"use client";

import { Mail, ArrowRight, Loader2, Phone, Check } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import scheduler to avoid hydration issues
const ConsultationScheduler = dynamic(() => import("./ConsultationScheduler"), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
    </div>
  )
});

export default function Collaborate() {
  const [view, setView] = useState<"main" | "scheduler">("main");
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    description: ""
  });
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side only rendering for interactive elements
  useEffect(() => {
    setIsClient(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.description) return;

    setFormState("submitting");

    try {
      // Submit to Formspree
      const formspreeResponse = await fetch("https://formspree.io/f/mandwdda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Project Inquiry",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company || "Not provided",
          description: formData.description
        })
      });

      if (!formspreeResponse.ok) {
        throw new Error("Formspree submission failed");
      }

      // Send confirmation email via Resend
      await fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name
        })
      });

      setFormState("success");
      setFormData({ name: "", email: "", phone: "", company: "", description: "" });
    } catch {
      setFormState("error");
    }
  }

  if (view === "scheduler") {
    return (
      <section id="collaborate" className="py-32 bg-zinc-950 border-t border-zinc-900 border-b">
        <div className="container-width">
          <div className="max-w-xl mx-auto">
            {isClient && <ConsultationScheduler onBack={() => setView("main")} />}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="collaborate" className="py-32 bg-zinc-950 border-t border-zinc-900 border-b">
      <div className="container-width">

        {/* Header */}
        <div className="mb-16">
          <div className="inline-block px-3 py-1 mb-6 rounded-full border border-zinc-800 bg-zinc-900/50">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Contact</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-6">
            Let&apos;s Build Together
          </h2>
          <p className="text-xl text-zinc-400 font-light max-w-2xl">
            Ready to start your project? Get in touch and let&apos;s discuss how Oryxen can help bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left Column: Contact Info + Scheduler Button */}
          <div className="space-y-8">
            <div className="p-6 rounded-lg bg-zinc-900/30 border border-zinc-800/50 flex items-start gap-4">
              <div className="p-3 bg-zinc-900 rounded-md">
                <Mail className="w-6 h-6 text-zinc-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-500 mb-1">Email</h3>
                <a href="mailto:oryxenconnect@gmail.com" className="text-lg font-medium text-white hover:text-zinc-300 transition-colors">
                  oryxenconnect@gmail.com
                </a>
              </div>
            </div>

            {/* Book Consultation Button */}
            {isClient && (
              <div
                role="button"
                tabIndex={0}
                onClick={() => setView("scheduler")}
                onKeyDown={(e) => e.key === "Enter" && setView("scheduler")}
                className="w-full p-6 rounded-lg bg-gradient-to-r from-zinc-900 to-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 text-left cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium mb-1">Book a Consultation</h3>
                    <p className="text-zinc-500 text-sm">Schedule a 30-minute call to discuss your project</p>
                  </div>
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                    <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Form */}
          <div className="bg-zinc-900/10 p-1 rounded-xl">
            {formState === "success" ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-zinc-900/20 rounded-lg border border-zinc-800 border-dashed">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent</h3>
                <p className="text-zinc-400">Thanks for reaching out. Check your inbox for a confirmation email.</p>
                {isClient && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => setFormState("idle")}
                    onKeyDown={(e) => e.key === "Enter" && setFormState("idle")}
                    className="mt-8 text-sm text-zinc-500 underline hover:text-white cursor-pointer"
                  >
                    Send another message
                  </span>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {formState === "error" && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    Something went wrong. Please try again or email us directly.
                  </div>
                )}

                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="collab-name" className="text-sm font-medium text-zinc-300">Name *</label>
                  <input
                    required
                    name="name"
                    id="collab-name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="collab-email" className="text-sm font-medium text-zinc-300">Email *</label>
                  <input
                    required
                    name="email"
                    id="collab-email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="you@company.com"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
                  />
                </div>

                {/* Phone (Optional) */}
                <div className="space-y-2">
                  <label htmlFor="collab-phone" className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    Phone *
                  </label>
                  <input
                    required
                    name="phone"
                    id="collab-phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
                  />
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <label htmlFor="collab-company" className="text-sm font-medium text-zinc-300">Company (optional)</label>
                  <input
                    name="company"
                    id="collab-company"
                    type="text"
                    autoComplete="organization"
                    value={formData.company}
                    onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                    placeholder="Your company"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="collab-description" className="text-sm font-medium text-zinc-300">Project Description *</label>
                  <textarea
                    required
                    name="description"
                    id="collab-description"
                    rows={5}
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Tell us about your project..."
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all resize-none"
                  />
                </div>

                <div className="pt-2 flex">
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="ml-auto flex items-center gap-2 bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formState === "submitting" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {formState === "submitting" ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
