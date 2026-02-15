"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// Detailed showcase projects with hardcoded descriptions
import { getVisibleShowcaseProjects, type ShowcaseProject } from "@/lib/supabase";

// Detailed showcase projects (fallback if DB is empty)
// Rich details for projects (fallback content)
const RICH_PROJECT_DETAILS: Record<string, any> = {
    "Fintech Dashboard": {
        details: {
            headline: "Institutional Grade Trading Platform",
            capabilities: ["Real time WebSocket data streaming", "Advanced chart visualization", "Instant order execution", "Portfolio risk management"],
            benefits: ["Identify market trends faster", "Execute complex strategies", "Secure and compliant infrastructure"],
            stack: ["Next.js", "TypeScript", "Go", "PostgreSQL"]
        }
    },
    "Health Monitor": {
        details: {
            headline: "Connected Health Ecosystem",
            capabilities: ["Bluetooth device integration", "Live vital sign monitoring", "Secure health data storage", "Doctor patient communication"],
            benefits: ["Remote patient monitoring", "Early warning detection", "HIPAA compliant architecture"],
            stack: ["React Native", "Swift", "Node.js", "MongoDB"]
        }
    },
    "Cloud Automation": {
        details: {
            headline: "Intelligent Infrastructure Management",
            capabilities: ["Auto scaling container orchestration", "Multi region failover", "Infrastructure as Code", "Cost optimization analytics"],
            benefits: ["Zero downtime deployments", "Reduced infrastructure costs", "Global low latency availability"],
            stack: ["Kubernetes", "Terraform", "AWS", "Rust"]
        }
    },
    "Logistics Engine": {
        details: {
            headline: "Supply Chain Intelligence",
            capabilities: ["Route optimization algorithms", "Real time fleet tracking", "Demand forecasting AI", "Warehouse automation integration"],
            benefits: ["Reduce delivery times", "Optimize inventory levels", "Lower operational costs"],
            stack: ["Python", "TensorFlow", "PostGIS", "Redis"]
        }
    },
    "E-Commerce Storefront": {
        details: {
            headline: "Modern Digital Commerce",
            capabilities: ["Headless commerce architecture", "One click checkout", "Inventory synchronization", "Customer behavior analytics"],
            benefits: ["Increase conversion rates", "Seamless omnichannel experience", "Scale to millions of users"],
            stack: ["Next.js", "Stripe", "Prisma", "Vercel"]
        }
    },
    "E Commerce Storefront": {
        details: {
            headline: "Modern Digital Commerce",
            capabilities: ["Headless commerce architecture", "One click checkout", "Inventory synchronization", "Customer behavior analytics"],
            benefits: ["Increase conversion rates", "Seamless omnichannel experience", "Scale to millions of users"],
            stack: ["Next.js", "Stripe", "Prisma", "Vercel"]
        }
    },
    "AI Chatbot & Support": {
        details: {
            headline: "Intelligent Customer Service",
            capabilities: ["Natural Language Processing", "Context aware responses", "Ticket escalation routing", "Multilingual support"],
            benefits: ["24/7 customer support", "Reduce support team load", "Consistent brand voice"],
            stack: ["OpenAI API", "Python", "Vector DB", "FastAPI"]
        }
    },
    "CRM & Sales Pipeline": {
        details: {
            headline: "Revenue Operations Platform",
            capabilities: ["Pipeline visualization", "Automated email sequences", "Activity tracking", "Performance forecasting"],
            benefits: ["Close deals faster", "Improve sales team efficiency", "Data driven decision making"],
            stack: ["React", "GraphQL", "Node.js", "PostgreSQL"]
        }
    },
    "LMS & Course Portal": {
        details: {
            headline: "Educational Experience Platform",
            capabilities: ["Video streaming & transcoding", "Interactive quizzes", "Progress certification", "Subscription management"],
            benefits: ["Monetize your expertise", "Engage students effectively", "Scale your educational content"],
            stack: ["Next.js", "Mux", "Supabase", "Stripe"]
        }
    },
    "Appointment Scheduler": {
        details: {
            headline: "Advanced Scheduling Solution",
            capabilities: ["Real time availability sync", "Automated SMS reminders", "Staff management", "Recurring bookings"],
            benefits: ["Eliminate double bookings", "Reduce no shows", "Streamline business operations"],
            stack: ["React", "Firebase", "Twilio", "Google Calendar API"]
        }
    },
    "Food Delivery Platform": {
        details: {
            headline: "On Demand Delivery Network",
            capabilities: ["Geospatial routing engine", "Real time status updates", "Driver dispatcher app", "Merchant tablet interface"],
            benefits: ["Optimize delivery routes", "Maximize order throughput", "Complete platform ownership"],
            stack: ["Flutter", "Go", "Redis", "PostGIS"]
        }
    }
};

export default function Showcase() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -600 : 600;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
    const [mounted, setMounted] = useState(false);
    const [projects, setProjects] = useState<ShowcaseProject[]>([]);
    const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);

    useEffect(() => {
        setMounted(true);

        async function loadProjects() {
            try {
                const data = await getVisibleShowcaseProjects();

                if (data && data.length > 0) {
                    const processedProjects = data.map(p => {
                        // Check if DB has details, if not, try to find in fallback
                        const fallback = RICH_PROJECT_DETAILS[p.title];
                        const mixedDetails = (p.details && p.details.headline) ? p.details : (fallback && fallback.details) ? fallback.details : {
                            headline: p.title,
                            capabilities: [],
                            benefits: [],
                            stack: []
                        };

                        return {
                            ...p,
                            color: p.color || "from-zinc-800/50 to-zinc-900/50",
                            details: mixedDetails
                        };
                    });
                    setProjects(processedProjects);
                } else {
                    setProjects([]);
                }
            } catch (error) {
                console.error("Failed to load showcase projects:", error);
                setProjects([]);
            }
        }

        loadProjects();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 lg:py-32 bg-black border-b border-zinc-900 overflow-hidden relative">
            <div className="container-width mb-12 flex justify-between items-end">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4">What We Build</h2>
                    <h3 className="text-3xl text-white font-medium tracking-tight mb-3">
                        Production ready. Custom branded. On demand.
                    </h3>
                    <p className="text-zinc-500 max-w-2xl text-sm leading-relaxed">
                        Every product ships with your logo, your domain, your colors.
                        We build, you own — fully white labeled and ready to launch.
                    </p>
                </motion.div>

                {/* Desktop Navigation Buttons */}
                <div className="hidden lg:flex gap-3">
                    <button
                        onClick={() => scroll('left')}
                        className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all flex items-center justify-center backdrop-blur-sm group"
                        aria-label="Scroll left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all flex items-center justify-center backdrop-blur-sm group"
                        aria-label="Scroll right"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 md:px-6 lg:px-[calc((100vw-1200px)/2+48px)] pb-12 scrollbar-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        onClick={() => setSelectedProject(project)}
                        className="flex-none w-[85vw] md:w-[600px] h-[400px] snap-center rounded-2xl bg-zinc-950 border border-zinc-800/50 relative overflow-hidden group cursor-pointer"
                    >
                        <motion.div
                            className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-50`}
                        />

                        {mounted && (
                            <div className="absolute inset-0 pointer-events-none">
                                {project.type === "fintech" && <FintechAnimation />}
                                {project.type === "health" && <HealthAnimation />}
                                {project.type === "cloud" && <CloudAutomationAnimation />}
                                {project.type === "logistics" && <LogisticsAnimation />}
                                {project.type === "ecommerce" && <EcommerceAnimation />}
                                {project.type === "chatbot" && <ChatbotAnimation />}
                                {project.type === "crm" && <CRMAnimation />}
                                {project.type === "lms" && <LMSAnimation />}
                                {project.type === "scheduler" && <SchedulerAnimation />}
                                {project.type === "delivery" && <DeliveryAnimation />}
                            </div>
                        )}

                        <motion.div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, transparent, rgba(255,255,255,0.02), transparent)',
                            }}
                        />

                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
                            <motion.span
                                className="text-[10px] font-medium text-zinc-500 mb-2 block uppercase tracking-[0.2em]"
                                initial={{ opacity: 0, x: -10 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: index * 0.1 + 0.2 }}
                            >
                                {project.category}
                            </motion.span>
                            <motion.h4
                                className="text-2xl font-semibold text-white mb-2 tracking-tight"
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                {project.title}
                            </motion.h4>
                            <motion.p
                                className="text-zinc-500 max-w-sm text-sm"
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: index * 0.1 + 0.4 }}
                            >
                                {project.description}
                            </motion.p>
                        </div>

                        <motion.div className="absolute top-6 right-6 pointer-events-auto">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProject(project);
                                }}
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-sm border border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white/10"
                            >
                                <span className="text-white/60 text-sm">→</span>
                            </button>
                        </motion.div>
                    </motion.div>
                ))}
                <div className="flex-none w-6 lg:w-[calc((100vw-1200px)/2)]" />
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative"
                        >
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors z-10 bg-zinc-900/50 backdrop-blur-sm p-1 rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar">
                                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2 block">{selectedProject.category}</span>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedProject.title}</h3>
                                <p className="text-zinc-400 text-base md:text-lg mb-6 md:mb-8 leading-relaxed max-w-xl">{selectedProject.details?.headline || selectedProject.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                                    <div>
                                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                                            Core Capabilities
                                        </h4>
                                        <ul className="space-y-2">
                                            {selectedProject.details?.capabilities?.map((item, i) => (
                                                <li key={i} className="text-xs md:text-sm text-zinc-400 flex items-start gap-2">
                                                    <span className="text-zinc-600 mt-0.5">›</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                            Business Benefits
                                        </h4>
                                        <ul className="space-y-2">
                                            {selectedProject.details?.benefits?.map((item, i) => (
                                                <li key={i} className="text-xs md:text-sm text-zinc-400 flex items-start gap-2">
                                                    <span className="text-zinc-600 mt-0.5">›</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="border-t border-zinc-800/50 pt-6">
                                    <h4 className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-3">Tech Stack</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.details?.stack?.map((tech, i) => (
                                            <span key={i} className="px-2 py-1 md:px-2.5 md:py-1 bg-zinc-800/50 border border-zinc-700/50 rounded text-[10px] md:text-xs text-zinc-300 font-mono">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-zinc-950/50 p-4 border-t border-zinc-800 flex justify-between items-center shrink-0">
                                <span className="text-xs text-zinc-500">Ready to deploy in 2-4 weeks</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProject(null);
                                        const contactSection = document.getElementById('collaborate');
                                        if (contactSection) {
                                            contactSection.scrollIntoView({ behavior: 'smooth' });
                                            // Update URL without reload
                                            window.history.pushState({}, '', `?project=${encodeURIComponent(selectedProject.title)}`);
                                            // Dispatch a custom event so Collaborate component can listen
                                            window.dispatchEvent(new Event('projectSelected'));
                                        }
                                    }}
                                    className="px-4 py-2 bg-white text-black text-xs font-medium rounded hover:bg-zinc-200 transition-colors uppercase tracking-wider"
                                >
                                    Start Project
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

// ===== EXISTING ANIMATIONS =====

// Apple-style Fintech - Clean Trading Interface
function FintechAnimation() {
    const priceData = [
        45, 48, 46, 52, 49, 55, 53, 58, 54, 60,
        57, 62, 59, 56, 61, 58, 64, 60, 66, 63,
        68, 65, 62, 67, 70, 68, 72, 69, 74, 71
    ];

    return (
        <div className="absolute inset-0 p-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">PORTFOLIO VALUE</div>
                    <motion.div
                        className="text-2xl font-light text-white tracking-tight"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        $127,849.32
                    </motion.div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">24H CHANGE</div>
                    <div className="text-sm text-emerald-500/80 font-medium">+2.41%</div>
                </div>
            </div>

            <div className="flex-1 relative">
                <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                    </defs>
                    {[25, 50, 75, 100, 125].map((y) => (
                        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    ))}
                    <motion.path
                        d={`M 0,150 ${priceData.map((p, i) => `L ${(i / (priceData.length - 1)) * 400},${150 - p * 1.8}`).join(' ')} L 400,150 Z`}
                        fill="url(#chartGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                    />
                    <motion.path
                        d={`M ${priceData.map((p, i) => `${(i / (priceData.length - 1)) * 400},${150 - p * 1.8}`).join(' L ')}`}
                        fill="none"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    />
                    <motion.circle
                        cx="400" cy={150 - priceData[priceData.length - 1] * 1.8} r="4" fill="white"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2, duration: 0.3 }}
                    />
                    <motion.circle
                        cx="400" cy={150 - priceData[priceData.length - 1] * 1.8} r="8"
                        fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
                        transition={{ delay: 2, duration: 2, repeat: Infinity }}
                    />
                </svg>
            </div>

            <div className="flex gap-8 mt-4 pt-4 border-t border-zinc-800/50">
                {[
                    { label: "BTC", value: "42,584.21", change: "+1.2%" },
                    { label: "ETH", value: "2,847.90", change: "+0.8%" },
                    { label: "SOL", value: "98.42", change: "-0.3%" },
                ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                        <div className="text-[9px] text-zinc-600 tracking-widest">{item.label}</div>
                        <div className="text-xs text-zinc-300 font-light">${item.value}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Apple-style Health - Minimal Biometrics
function HealthAnimation() {
    return (
        <div className="absolute inset-0 p-8 flex flex-col">
            <div className="flex items-center gap-6 mb-8">
                <div>
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">HEART RATE</div>
                    <div className="flex items-baseline gap-2">
                        <motion.span className="text-4xl font-light text-white" animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>72</motion.span>
                        <span className="text-sm text-zinc-600">BPM</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 relative overflow-hidden">
                <svg className="w-full h-24" viewBox="0 0 600 80" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="ecgLine" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                            <stop offset="30%" stopColor="rgba(255,255,255,0.3)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
                        </linearGradient>
                    </defs>
                    <motion.path
                        d="M0,40 L60,40 L70,40 L80,35 L90,45 L100,10 L110,70 L120,40 L180,40 L190,40 L200,35 L210,45 L220,10 L230,70 L240,40 L300,40 L310,40 L320,35 L330,45 L340,10 L350,70 L360,40 L420,40 L430,40 L440,35 L450,45 L460,10 L470,70 L480,40 L540,40 L550,40 L560,35 L570,45 L580,10 L590,70 L600,40"
                        fill="none" stroke="url(#ecgLine)" strokeWidth="1.5" strokeLinecap="round"
                        animate={{ strokeDashoffset: [600, 0] }}
                        style={{ strokeDasharray: "600" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                </svg>
            </div>
            <div className="absolute top-8 right-8 w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                    <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                    <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                    {[
                        { r: 42, progress: 0.78, color: "rgba(255,255,255,0.6)" },
                        { r: 32, progress: 0.62, color: "rgba(255,255,255,0.4)" },
                        { r: 22, progress: 0.91, color: "rgba(255,255,255,0.3)" },
                    ].map((ring, i) => (
                        <motion.circle key={i} cx="50" cy="50" r={ring.r} fill="none" stroke={ring.color}
                            strokeWidth="5" strokeLinecap="round" transform="rotate(-90 50 50)"
                            initial={{ strokeDasharray: `0 ${2 * Math.PI * ring.r}` }}
                            animate={{ strokeDasharray: `${ring.progress * 2 * Math.PI * ring.r} ${2 * Math.PI * ring.r}` }}
                            transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                        />
                    ))}
                </svg>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-auto pt-6 border-t border-zinc-800/50">
                {[
                    { value: "98%", label: "O₂" },
                    { value: "7.2h", label: "Sleep" },
                    { value: "2.1k", label: "Cal" },
                    { value: "8.4k", label: "Steps" },
                ].map((stat, i) => (
                    <motion.div key={i} className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}>
                        <div className="text-lg font-light text-white">{stat.value}</div>
                        <div className="text-[9px] text-zinc-600 tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Cloud Automation
function CloudAutomationAnimation() {
    return (
        <div className="absolute inset-0 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">INFRASTRUCTURE</div>
                    <div className="text-xl font-light text-white">All Systems Operational</div>
                </div>
                <motion.div className="w-2 h-2 bg-emerald-500/60 rounded-full" animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            </div>
            <div className="flex-1 relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 300 180">
                    <ellipse cx="150" cy="90" rx="120" ry="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <ellipse cx="150" cy="90" rx="80" ry="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <ellipse cx="150" cy="90" rx="40" ry="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <motion.circle cx="150" cy="90" r="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" animate={{ r: [20, 22, 20] }} transition={{ duration: 2, repeat: Infinity }} />
                    <circle cx="150" cy="90" r="8" fill="rgba(255,255,255,0.15)" />
                    {[0, 90, 180, 270].map((angle, i) => (
                        <motion.g key={`outer-${i}`} animate={{ rotate: [angle, angle + 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "150px 90px" }}>
                            <circle cx="270" cy="90" r="6" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                            <motion.circle cx="270" cy="90" r="2" fill="white" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
                        </motion.g>
                    ))}
                    {[45, 135, 225, 315].map((angle, i) => (
                        <motion.g key={`mid-${i}`} animate={{ rotate: [angle, angle - 360] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "150px 90px" }}>
                            <circle cx="230" cy="90" r="5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                            <motion.circle cx="230" cy="90" r="1.5" fill="white" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
                        </motion.g>
                    ))}
                    {[0, 120, 240].map((angle, i) => (
                        <motion.circle key={`packet-${i}`} r="3" fill="white"
                            animate={{ cx: [150 + 100 * Math.cos(angle * Math.PI / 180), 150], cy: [90 + 50 * Math.sin(angle * Math.PI / 180), 90], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
                        />
                    ))}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                        <motion.line key={`line-${i}`} x1="150" y1="90" x2={150 + 100 * Math.cos(angle * Math.PI / 180)} y2={90 + 50 * Math.sin(angle * Math.PI / 180)}
                            stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        />
                    ))}
                </svg>
            </div>
            <div className="flex gap-10 pt-4 border-t border-zinc-800/50">
                {[{ value: "24", label: "Instances" }, { value: "99.9%", label: "Uptime" }, { value: "12ms", label: "Latency" }].map((metric, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                        <div className="text-lg font-light text-white">{metric.value}</div>
                        <div className="text-[9px] text-zinc-600 tracking-widest">{metric.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Logistics
function LogisticsAnimation() {
    return (
        <div className="absolute inset-0 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">SUPPLY CHAIN</div>
                    <div className="text-xl font-light text-white">847 Active Shipments</div>
                </div>
                <div className="flex items-center gap-2">
                    <motion.div className="w-1.5 h-1.5 bg-white/60 rounded-full" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                    <span className="text-[9px] text-zinc-500">LIVE</span>
                </div>
            </div>
            <div className="flex-1 relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 300 160">
                    <circle cx="150" cy="80" r="65" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <ellipse cx="150" cy="80" rx="65" ry="25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <ellipse cx="150" cy="80" rx="65" ry="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" transform="rotate(60 150 80)" />
                    <ellipse cx="150" cy="80" rx="65" ry="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" transform="rotate(-60 150 80)" />
                    {[
                        { x: 60, y: 60, label: "NYC" }, { x: 110, y: 100, label: "LA" },
                        { x: 180, y: 50, label: "LON" }, { x: 230, y: 90, label: "TKY" }, { x: 150, y: 130, label: "SYD" },
                    ].map((node, i) => (
                        <g key={i}>
                            <motion.circle cx={node.x} cy={node.y} r="12" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" animate={{ r: [12, 16, 12], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
                            <motion.circle cx={node.x} cy={node.y} r="6" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1, duration: 0.3 }} />
                            <motion.circle cx={node.x} cy={node.y} r="2" fill="white" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
                            <text x={node.x} y={node.y + 20} textAnchor="middle" className="text-[8px] fill-zinc-500 font-light tracking-wider">{node.label}</text>
                        </g>
                    ))}
                    {[
                        { d: "M 60,60 Q 85,30 110,100", delay: 0 },
                        { d: "M 110,100 Q 145,60 180,50", delay: 0.2 },
                        { d: "M 180,50 Q 205,70 230,90", delay: 0.4 },
                        { d: "M 230,90 Q 190,120 150,130", delay: 0.6 },
                    ].map((path, i) => (
                        <motion.path key={i} d={path.d} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 3" animate={{ strokeDashoffset: [0, -14] }} transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: path.delay }} />
                    ))}
                    <motion.circle r="4" fill="white" animate={{ cx: [60, 110, 180, 230, 150, 60], cy: [60, 100, 50, 90, 130, 60] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
                    <motion.circle r="3" fill="rgba(255,255,255,0.6)" animate={{ cx: [180, 230, 150, 60, 110, 180], cy: [50, 90, 130, 60, 100, 50] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
                </svg>
            </div>
            <div className="flex gap-4 mb-4">
                {[{ label: "Processing", progress: 0.85 }, { label: "In Transit", progress: 0.62 }, { label: "Delivered", progress: 0.94 }].map((item, i) => (
                    <div key={i} className="flex-1">
                        <div className="flex justify-between text-[8px] mb-1">
                            <span className="text-zinc-500">{item.label}</span>
                            <span className="text-zinc-400">{Math.round(item.progress * 100)}%</span>
                        </div>
                        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-white/40 rounded-full" initial={{ width: 0 }} animate={{ width: `${item.progress * 100}%` }} transition={{ duration: 1, delay: 0.5 + i * 0.2 }} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex gap-8 pt-4 border-t border-zinc-800/50">
                {[{ value: "2.3d", label: "Avg Transit" }, { value: "12.4K", label: "Delivered" }, { value: "98.2%", label: "On Time" }].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                        <div className="text-lg font-light text-white">{stat.value}</div>
                        <div className="text-[9px] text-zinc-600 tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// ===== NEW ANIMATIONS =====

// E-Commerce Storefront
function EcommerceAnimation() {
    return (
        <div className="absolute inset-0 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">STORE ANALYTICS</div>
                    <div className="text-xl font-light text-white">$48,291 Revenue</div>
                </div>
                <motion.div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}>
                    <span className="text-[10px] text-emerald-400">+18.3%</span>
                </motion.div>
            </div>

            {/* Product grid mockup */}
            <div className="flex-1 grid grid-cols-3 gap-2">
                {[
                    { price: "$129", sold: "84" },
                    { price: "$79", sold: "156" },
                    { price: "$249", sold: "42" },
                    { price: "$59", sold: "211" },
                    { price: "$189", sold: "67" },
                    { price: "$99", sold: "128" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className="rounded-lg bg-zinc-800/30 border border-zinc-800/50 p-2 flex flex-col justify-end"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <motion.div
                            className="w-full h-1 bg-zinc-700 rounded-full mb-1.5 overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                        >
                            <motion.div
                                className="h-full bg-white/30 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${40 + Math.random() * 50}%` }}
                                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                            />
                        </motion.div>
                        <div className="text-[10px] text-zinc-400">{item.price}</div>
                        <div className="text-[8px] text-zinc-600">{item.sold} sold</div>
                    </motion.div>
                ))}
            </div>

            {/* Checkout funnel */}
            <div className="flex gap-6 pt-4 mt-3 border-t border-zinc-800/50">
                {[{ value: "3.2K", label: "Visitors" }, { value: "8.4%", label: "Conv Rate" }, { value: "247", label: "Orders" }].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                        <div className="text-lg font-light text-white">{stat.value}</div>
                        <div className="text-[9px] text-zinc-600 tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// AI Chatbot & Support
function ChatbotAnimation() {
    const messages = [
        { type: "user", text: "I need help with my order #4821" },
        { type: "bot", text: "I found your order. It shipped yesterday and will arrive by Friday." },
        { type: "user", text: "Can I change the delivery address?" },
        { type: "bot", text: "Done! I've updated the address. You'll receive a confirmation email shortly." },
    ];

    return (
        <div className="absolute inset-0 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">AI ASSISTANT</div>
                    <div className="text-xl font-light text-white">Live Conversation</div>
                </div>
                <div className="flex items-center gap-2">
                    <motion.div className="w-1.5 h-1.5 bg-emerald-500/80 rounded-full" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                    <span className="text-[9px] text-zinc-500">ONLINE</span>
                </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: i * 0.8, duration: 0.3 }}
                    >
                        <div className={`max-w-[75%] px-3 py-2 rounded-xl text-[11px] leading-relaxed ${msg.type === "user"
                            ? "bg-white/10 text-zinc-300 rounded-br-sm"
                            : "bg-zinc-800/60 text-zinc-400 border border-zinc-700/50 rounded-bl-sm"
                            }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
                {/* Typing indicator */}
                <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.5 }}
                >
                    <div className="px-3 py-2 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex gap-1">
                        {[0, 1, 2].map(i => (
                            <motion.div key={i} className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="flex gap-6 pt-4 mt-3 border-t border-zinc-800/50">
                {[{ value: "94%", label: "Resolved" }, { value: "1.2s", label: "Avg Reply" }, { value: "4.9★", label: "Rating" }].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                        <div className="text-lg font-light text-white">{stat.value}</div>
                        <div className="text-[9px] text-zinc-600 tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// CRM & Sales Pipeline
function CRMAnimation() {
    const stages = [
        { name: "Lead", count: 42, width: "100%" },
        { name: "Qualified", count: 28, width: "67%" },
        { name: "Proposal", count: 15, width: "36%" },
        { name: "Negotiation", count: 8, width: "19%" },
        { name: "Won", count: 5, width: "12%" },
    ];

    return (
        <div className="absolute inset-0 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">SALES PIPELINE</div>
                    <div className="text-xl font-light text-white">$1.24M Pipeline</div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">WIN RATE</div>
                    <div className="text-sm text-emerald-500/80 font-medium">32%</div>
                </div>
            </div>

            {/* Funnel visualization */}
            <div className="flex-1 flex flex-col justify-center gap-2">
                {stages.map((stage, i) => (
                    <motion.div key={i} className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                    >
                        <span className="text-[9px] text-zinc-500 w-16 text-right tracking-wider">{stage.name}</span>
                        <div className="flex-1 h-5 bg-zinc-800/30 rounded-sm overflow-hidden">
                            <motion.div
                                className="h-full rounded-sm flex items-center justify-end pr-2"
                                style={{ background: `rgba(255,255,255,${0.08 + i * 0.03})` }}
                                initial={{ width: 0 }}
                                animate={{ width: stage.width }}
                                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                            >
                                <span className="text-[9px] text-zinc-400 font-medium">{stage.count}</span>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-6 pt-4 mt-3 border-t border-zinc-800/50">
                {[{ value: "$248K", label: "Avg Deal" }, { value: "18d", label: "Avg Cycle" }, { value: "42", label: "Active" }].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                        <div className="text-lg font-light text-white">{stat.value}</div>
                        <div className="text-[9px] text-zinc-600 tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// LMS & Course Portal
function LMSAnimation() {
    const courses = [
        { title: "React Mastery", students: 1284, progress: 0.72 },
        { title: "System Design", students: 892, progress: 0.58 },
        { title: "Node.js Advanced", students: 634, progress: 0.85 },
        { title: "UI/UX Pro", students: 1102, progress: 0.44 },
    ];

    return (
        <div className="absolute inset-0 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">LEARNING PLATFORM</div>
                    <div className="text-xl font-light text-white">3,912 Students</div>
                </div>
                <motion.div
                    className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center"
                    animate={{ borderColor: ["rgba(63,63,70,1)", "rgba(255,255,255,0.3)", "rgba(63,63,70,1)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-[10px] text-white/60">▶</span>
                </motion.div>
            </div>

            {/* Course cards */}
            <div className="flex-1 flex flex-col gap-2.5">
                {courses.map((course, i) => (
                    <motion.div
                        key={i}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-800/20 border border-zinc-800/40"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 }}
                    >
                        <div className="w-8 h-8 rounded-md bg-zinc-700/30 flex items-center justify-center flex-shrink-0">
                            <motion.div className="w-2 h-2 bg-white/40 rounded-sm"
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[11px] text-zinc-300 truncate">{course.title}</div>
                            <div className="text-[9px] text-zinc-600">{course.students} enrolled</div>
                        </div>
                        <div className="w-16 flex-shrink-0">
                            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div className="h-full bg-white/30 rounded-full" initial={{ width: 0 }} animate={{ width: `${course.progress * 100}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.1 }} />
                            </div>
                            <div className="text-[8px] text-zinc-600 text-right mt-0.5">{Math.round(course.progress * 100)}%</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-6 pt-4 mt-3 border-t border-zinc-800/50">
                {[{ value: "24", label: "Courses" }, { value: "92%", label: "Completion" }, { value: "$84K", label: "MRR" }].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                        <div className="text-lg font-light text-white">{stat.value}</div>
                        <div className="text-[9px] text-zinc-600 tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Appointment Scheduler
function SchedulerAnimation() {
    const hours = ["9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00"];
    const bookings = [
        { start: 0, span: 1, title: "Dr. Patel", color: "rgba(255,255,255,0.12)" },
        { start: 2, span: 2, title: "Consultation", color: "rgba(255,255,255,0.08)" },
        { start: 5, span: 1, title: "Follow-up", color: "rgba(255,255,255,0.10)" },
    ];

    return (
        <div className="absolute inset-0 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">TODAY&apos;S SCHEDULE</div>
                    <div className="text-xl font-light text-white">8 Appointments</div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">NEXT</div>
                    <div className="text-sm text-white/60 font-medium">10:00 AM</div>
                </div>
            </div>

            {/* Calendar timeline */}
            <div className="flex-1 relative">
                {hours.map((hour, i) => (
                    <motion.div key={i} className="flex items-start gap-3 h-[14.28%]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <span className="text-[9px] text-zinc-600 w-10 text-right pt-0.5">{hour}</span>
                        <div className="flex-1 border-t border-zinc-800/50 relative h-full" />
                    </motion.div>
                ))}

                {/* Booking blocks */}
                {bookings.map((booking, i) => (
                    <motion.div
                        key={i}
                        className="absolute left-14 right-2 rounded-md px-2 py-1 border border-zinc-700/30"
                        style={{
                            top: `${(booking.start / hours.length) * 100}%`,
                            height: `${(booking.span / hours.length) * 100}%`,
                            background: booking.color,
                        }}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ delay: 0.5 + i * 0.2, duration: 0.3 }}
                    >
                        <span className="text-[10px] text-zinc-300">{booking.title}</span>
                    </motion.div>
                ))}

                {/* Current time indicator */}
                <motion.div
                    className="absolute left-14 right-2 h-px bg-cyan-500/50"
                    style={{ top: "28%" }}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <div className="absolute -left-1 -top-1 w-2 h-2 bg-cyan-500 rounded-full" />
                </motion.div>
            </div>

            <div className="flex gap-6 pt-4 mt-3 border-t border-zinc-800/50">
                {[{ value: "96%", label: "Attendance" }, { value: "12min", label: "Avg Wait" }, { value: "4.8★", label: "Rating" }].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                        <div className="text-lg font-light text-white">{stat.value}</div>
                        <div className="text-[9px] text-zinc-600 tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Food Delivery Platform
function DeliveryAnimation() {
    return (
        <div className="absolute inset-0 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-[10px] text-zinc-600 tracking-widest mb-1">DELIVERY OPS</div>
                    <div className="text-xl font-light text-white">132 Active Orders</div>
                </div>
                <div className="flex items-center gap-2">
                    <motion.div className="w-1.5 h-1.5 bg-emerald-500/80 rounded-full" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                    <span className="text-[9px] text-zinc-500">LIVE</span>
                </div>
            </div>

            {/* Map-like grid with moving dots */}
            <div className="flex-1 relative">
                <svg className="w-full h-full" viewBox="0 0 300 160">
                    {/* Grid */}
                    {[0, 30, 60, 90, 120, 150].map(y => (
                        <line key={`h-${y}`} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    ))}
                    {[0, 50, 100, 150, 200, 250, 300].map(x => (
                        <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="160" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    ))}

                    {/* Road network */}
                    <path d="M 20,80 L 280,80" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                    <path d="M 150,10 L 150,150" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                    <path d="M 50,30 L 250,130" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <path d="M 50,130 L 250,30" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                    {/* Restaurant locations */}
                    {[
                        { x: 60, y: 40 }, { x: 200, y: 50 }, { x: 120, y: 120 }, { x: 240, y: 110 },
                    ].map((loc, i) => (
                        <g key={`rest-${i}`}>
                            <rect x={loc.x - 4} y={loc.y - 4} width="8" height="8" rx="2" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                            <motion.rect x={loc.x - 6} y={loc.y - 6} width="12" height="12" rx="3" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            />
                        </g>
                    ))}

                    {/* Moving delivery drivers */}
                    {[
                        { path: "M 60,40 L 150,80 L 240,110", delay: 0 },
                        { path: "M 200,50 L 150,80 L 120,120", delay: 1.5 },
                        { path: "M 120,120 L 150,80 L 200,50", delay: 3 },
                    ].map((route, i) => (
                        <motion.circle key={`driver-${i}`} r="4" fill="white" filter="url(#deliveryGlow)">
                            <animateMotion dur="4s" begin={`${route.delay}s`} repeatCount="indefinite" path={route.path} />
                        </motion.circle>
                    ))}

                    <defs>
                        <filter id="deliveryGlow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                </svg>
            </div>

            {/* Order status bar */}
            <div className="flex gap-3 mb-3">
                {[
                    { label: "Preparing", value: 48, color: "bg-amber-500/30" },
                    { label: "In Transit", value: 64, color: "bg-white/20" },
                    { label: "Delivered", value: 320, color: "bg-emerald-500/20" },
                ].map((status, i) => (
                    <motion.div key={i} className={`flex-1 py-1.5 px-2 rounded-md ${status.color} border border-zinc-800/50`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                    >
                        <div className="text-[10px] text-zinc-400">{status.label}</div>
                        <div className="text-sm text-white font-light">{status.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-6 pt-4 border-t border-zinc-800/50">
                {[{ value: "28min", label: "Avg Time" }, { value: "4.7★", label: "Rating" }, { value: "$32", label: "Avg Order" }].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                        <div className="text-lg font-light text-white">{stat.value}</div>
                        <div className="text-[9px] text-zinc-600 tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
