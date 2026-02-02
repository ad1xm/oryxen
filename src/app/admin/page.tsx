"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff, Mail, Calendar, FileText, MessageSquare, Check, Loader2, Lock, Plus, Trash2, Edit3, Save, X, Layout, BarChart3, Briefcase } from "lucide-react";
import Link from "next/link";

type Tab = "submissions" | "testimonials" | "showcase" | "content" | "stats" | "slots";

interface Submission {
    id: string;
    type: string;
    name: string;
    email: string;
    company?: string;
    message: string;
    created_at: string;
    is_read: boolean;
}

interface Testimonial {
    id: string;
    quote: string;
    name: string;
    role: string;
    location: string;
    is_visible: boolean;
    order: number;
}

interface ShowcaseProject {
    id: string;
    category: string;
    title: string;
    description: string;
    type: string;
    order: number;
    is_visible: boolean;
}

interface Stat {
    id: string;
    label: string;
    value: string;
    order: number;
}

interface ContentItem {
    id: string;
    section: string;
    key: string;
    value: string;
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [activeTab, setActiveTab] = useState<Tab>("submissions");

    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [showcase, setShowcase] = useState<ShowcaseProject[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [content, setContent] = useState<ContentItem[]>([]);
    const [slots, setSlots] = useState<any[]>([]); // Consultation slots

    // Modal states
    const [editingItem, setEditingItem] = useState<unknown>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<string>("");

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const res = await fetch('/api/admin?resource=verify');
            if (res.ok) {
                setIsAuthenticated(true);
                loadData();
            }
        } catch {
            // Not authenticated
        } finally {
            setIsLoading(false);
        }
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoginError("");

        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', password })
            });

            if (res.ok) {
                setIsAuthenticated(true);
                loadData();
            } else {
                setLoginError("Invalid password");
            }
        } catch {
            setLoginError("Login failed");
        }
    }

    async function handleLogout() {
        await fetch('/api/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'logout' })
        });
        setIsAuthenticated(false);
    }

    async function loadData() {
        try {
            const [subRes, testRes, showRes, statRes, contentRes, slotsRes] = await Promise.all([
                fetch('/api/admin?resource=submissions'),
                fetch('/api/admin?resource=testimonials'),
                fetch('/api/admin?resource=showcase'),
                fetch('/api/admin?resource=stats'),
                fetch('/api/admin?resource=content'),
                fetch('/api/admin?resource=slots')
            ]);

            if (subRes.ok) setSubmissions(await subRes.json());
            if (testRes.ok) setTestimonials(await testRes.json());
            if (showRes.ok) setShowcase(await showRes.json());
            if (statRes.ok) setStats(await statRes.json());
            if (contentRes.ok) setContent(await contentRes.json());
            if (slotsRes.ok) setSlots(await slotsRes.json());
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }

    // CRUD Operations
    async function createItem(resource: string, data: Record<string, unknown>) {
        const res = await fetch('/api/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create', resource, data })
        });
        if (res.ok) {
            loadData();
            setIsModalOpen(false);
        }
    }

    async function updateItem(resource: string, id: string, data: Record<string, unknown>) {
        await fetch('/api/admin', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resource, id, data })
        });
        loadData();
        setIsModalOpen(false);
    }

    async function deleteItem(resource: string, id: string) {
        if (!confirm('Are you sure you want to delete this item?')) return;
        await fetch('/api/admin', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resource, id })
        });
        loadData();
    }

    async function markAsRead(id: string) {
        await updateItem('submission', id, { is_read: true });
    }

    function openModal(type: string, item?: unknown) {
        setModalType(type);
        setEditingItem(item || null);
        setIsModalOpen(true);
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <Lock className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
                        <p className="text-zinc-500 text-sm">Enter your admin password to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                        />
                        {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
                        <button
                            type="submit"
                            className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-zinc-200 transition-colors"
                        >
                            Login
                        </button>
                    </form>

                    <Link href="/" className="block text-center mt-6 text-zinc-500 hover:text-white text-sm transition-colors">
                        ← Back to website
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-lg font-bold">ORYXEN Admin</h1>
                </div>
                <button
                    onClick={handleLogout}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                >
                    Logout
                </button>
            </header>

            {/* Tabs */}
            <div className="border-b border-zinc-800 px-6 overflow-x-auto">
                <nav className="flex gap-6">
                    {[
                        { id: "submissions", label: "Submissions", icon: Mail, count: submissions.filter(s => !s.is_read).length },
                        { id: "testimonials", label: "Testimonials", icon: MessageSquare },
                        { id: "showcase", label: "Showcase", icon: Layout },
                        { id: "stats", label: "Stats", icon: BarChart3 },
                        { id: "content", label: "Content", icon: FileText },
                        { id: "slots", label: "Consultation Slots", icon: Calendar, count: slots.filter((s: any) => !s.is_available).length }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex items-center gap-2 py-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? "border-cyan-500 text-white"
                                : "border-transparent text-zinc-500 hover:text-white"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {tab.count ? (
                                <span className="bg-cyan-500 text-black text-xs px-1.5 py-0.5 rounded-full font-bold">
                                    {tab.count}
                                </span>
                            ) : null}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="p-6 max-w-6xl mx-auto">
                {/* Submissions Tab */}
                {activeTab === "submissions" && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-6">Form Submissions</h2>
                        {submissions.length === 0 ? (
                            <p className="text-zinc-500 text-center py-12">No submissions yet</p>
                        ) : (
                            submissions.map(sub => (
                                <div
                                    key={sub.id}
                                    className={`p-6 rounded-lg border transition-colors ${sub.is_read ? "bg-zinc-900/30 border-zinc-800" : "bg-zinc-900/50 border-cyan-900/30"
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <span className="text-xs font-mono text-cyan-500 uppercase">{sub.type}</span>
                                            <h3 className="text-lg font-medium text-white">{sub.name}</h3>
                                            <p className="text-sm text-zinc-500">{sub.email} {sub.company && `• ${sub.company}`}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-zinc-600">{new Date(sub.created_at).toLocaleDateString()}</span>
                                            {!sub.is_read && (
                                                <button
                                                    onClick={() => markAsRead(sub.id)}
                                                    className="p-1 text-zinc-500 hover:text-green-500 transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteItem('submission', sub.id)}
                                                className="p-1 text-zinc-500 hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-zinc-400">{sub.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Testimonials Tab */}
                {activeTab === "testimonials" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Testimonials</h2>
                            <button
                                onClick={() => openModal('testimonial')}
                                className="flex items-center gap-2 bg-cyan-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add New
                            </button>
                        </div>
                        {testimonials.length === 0 ? (
                            <p className="text-zinc-500 text-center py-12">No testimonials yet. Add your first one!</p>
                        ) : (
                            testimonials.map(test => (
                                <div
                                    key={test.id}
                                    className={`p-6 rounded-lg border flex items-start justify-between gap-4 ${test.is_visible ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-900/20 border-zinc-800/50 opacity-60"
                                        }`}
                                >
                                    <div className="flex-1">
                                        <p className="text-zinc-300 mb-2">"{test.quote}"</p>
                                        <p className="text-sm text-zinc-500">{test.name} • {test.role}, {test.location}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openModal('testimonial', test)}
                                            className="p-2 text-zinc-500 hover:text-white transition-colors"
                                            title="Edit"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => updateItem('testimonial', test.id, { is_visible: !test.is_visible })}
                                            className={`p-2 rounded-lg transition-colors ${test.is_visible ? "text-green-500" : "text-zinc-500"}`}
                                            title={test.is_visible ? "Hide" : "Show"}
                                        >
                                            {test.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => deleteItem('testimonial', test.id)}
                                            className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Showcase Tab */}
                {activeTab === "showcase" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Showcase Projects</h2>
                            <button
                                onClick={() => openModal('showcase')}
                                className="flex items-center gap-2 bg-cyan-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Project
                            </button>
                        </div>
                        {showcase.length === 0 ? (
                            <p className="text-zinc-500 text-center py-12">No projects yet. Add your first one!</p>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {showcase.map(project => (
                                    <div
                                        key={project.id}
                                        className={`p-6 rounded-lg border ${project.is_visible ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-900/20 border-zinc-800/50 opacity-60"}`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-xs font-mono text-cyan-500 uppercase">{project.category}</span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => openModal('showcase', project)}
                                                    className="p-1 text-zinc-500 hover:text-white transition-colors"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => updateItem('showcase', project.id, { is_visible: !project.is_visible })}
                                                    className={`p-1 transition-colors ${project.is_visible ? "text-green-500" : "text-zinc-500"}`}
                                                >
                                                    {project.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => deleteItem('showcase', project.id)}
                                                    className="p-1 text-zinc-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-medium text-white mb-1">{project.title}</h3>
                                        <p className="text-sm text-zinc-500">{project.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Stats Tab */}
                {activeTab === "stats" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Stats & Numbers</h2>
                            <button
                                onClick={() => openModal('stat')}
                                className="flex items-center gap-2 bg-cyan-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Stat
                            </button>
                        </div>
                        {stats.length === 0 ? (
                            <p className="text-zinc-500 text-center py-12">No stats yet. Add your first one!</p>
                        ) : (
                            <div className="grid md:grid-cols-3 gap-4">
                                {stats.map(stat => (
                                    <div key={stat.id} className="p-6 rounded-lg border bg-zinc-900/50 border-zinc-800">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                                                <p className="text-sm text-zinc-500">{stat.label}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => openModal('stat', stat)}
                                                    className="p-1 text-zinc-500 hover:text-white transition-colors"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteItem('stat', stat.id)}
                                                    className="p-1 text-zinc-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Content Tab */}
                {activeTab === "content" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Site Content</h2>
                            <button
                                onClick={() => openModal('content')}
                                className="flex items-center gap-2 bg-cyan-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-cyan-400 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Content
                            </button>
                        </div>
                        {content.length === 0 ? (
                            <div className="text-zinc-500 text-center py-12">
                                <p className="mb-4">No content items yet.</p>
                                <p className="text-sm">Add content items for sections like Hero, About, etc.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {content.map(item => (
                                    <div key={item.id} className="p-6 rounded-lg border bg-zinc-900/50 border-zinc-800">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <span className="text-xs font-mono text-cyan-500 uppercase">{item.section}</span>
                                                <span className="text-xs text-zinc-600 mx-2">•</span>
                                                <span className="text-xs text-zinc-400">{item.key}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => openModal('content', item)}
                                                    className="p-1 text-zinc-500 hover:text-white transition-colors"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteItem('content', item.id)}
                                                    className="p-1 text-zinc-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-zinc-300">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <Modal
                    type={modalType}
                    item={editingItem}
                    onClose={() => setIsModalOpen(false)}
                    onCreate={createItem}
                    onUpdate={updateItem}
                />
            )}

            {/* Consultation Slots Tab */}
            {activeTab === "slots" && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold mb-6">Consultation Slots</h2>
                    {slots.length === 0 ? (
                        <p className="text-zinc-500 text-center py-12">No consultation slots yet</p>
                    ) : (
                        <div className="space-y-2">
                            {slots.map((slot: any) => (
                                <div
                                    key={slot.id}
                                    className={`p-4 rounded-lg border ${!slot.is_available
                                            ? "bg-red-500/10 border-red-500/30"
                                            : "bg-green-500/10 border-green-500/30"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-white">
                                                    {new Date(slot.date).toLocaleDateString()}
                                                </span>
                                                <span className="font-mono text-cyan-400">{slot.time}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${!slot.is_available
                                                        ? "bg-red-500/20 text-red-400"
                                                        : "bg-green-500/20 text-green-400"
                                                    }`}>
                                                    {slot.is_available ? "Available" : "Booked"}
                                                </span>
                                            </div>
                                            {!slot.is_available && slot.booked_by_name && (
                                                <p className="text-sm text-zinc-400 mt-2">
                                                    <strong>{slot.booked_by_name}</strong> • {slot.booked_by_email}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => deleteItem('slot', slot.id)}
                                            className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                                            title="Delete slot"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}

// Modal Component
function Modal({
    type,
    item,
    onClose,
    onCreate,
    onUpdate
}: {
    type: string;
    item: unknown;
    onClose: () => void;
    onCreate: (resource: string, data: Record<string, unknown>) => void;
    onUpdate: (resource: string, id: string, data: Record<string, unknown>) => void;
}) {
    const [formData, setFormData] = useState<Record<string, unknown>>(() => {
        if (item && typeof item === 'object') return { ...item as Record<string, unknown> };

        // Default values for new items
        switch (type) {
            case 'testimonial':
                return { quote: '', name: '', role: '', location: '', order: 0, is_visible: true };
            case 'showcase':
                return { category: '', title: '', description: '', type: 'fintech', order: 0, is_visible: true };
            case 'stat':
                return { label: '', value: '', order: 0 };
            case 'content':
                return { section: '', key: '', value: '' };
            default:
                return {};
        }
    });

    const isEditing = item && typeof item === 'object' && 'id' in item;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isEditing && typeof item === 'object' && 'id' in item) {
            onUpdate(type, (item as { id: string }).id, formData);
        } else {
            onCreate(type, formData);
        }
    }

    function updateField(key: string, value: unknown) {
        setFormData(prev => ({ ...prev, [key]: value }));
    }

    const titles: Record<string, string> = {
        testimonial: 'Testimonial',
        showcase: 'Project',
        stat: 'Stat',
        content: 'Content'
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h3 className="text-lg font-bold text-white">
                        {isEditing ? 'Edit' : 'Add'} {titles[type]}
                    </h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {type === 'testimonial' && (
                        <>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Quote</label>
                                <textarea
                                    value={formData.quote as string || ''}
                                    onChange={e => updateField('quote', e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 resize-none"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name as string || ''}
                                        onChange={e => updateField('name', e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Role</label>
                                    <input
                                        type="text"
                                        value={formData.role as string || ''}
                                        onChange={e => updateField('role', e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location as string || ''}
                                        onChange={e => updateField('location', e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Order</label>
                                    <input
                                        type="number"
                                        value={formData.order as number || 0}
                                        onChange={e => updateField('order', parseInt(e.target.value))}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {type === 'showcase' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category as string || ''}
                                        onChange={e => updateField('category', e.target.value)}
                                        placeholder="e.g. Web Application"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Type</label>
                                    <select
                                        value={formData.type as string || 'fintech'}
                                        onChange={e => updateField('type', e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                    >
                                        <option value="fintech">Fintech</option>
                                        <option value="health">Health</option>
                                        <option value="cloud">Cloud</option>
                                        <option value="logistics">Logistics</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title as string || ''}
                                    onChange={e => updateField('title', e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Description</label>
                                <textarea
                                    value={formData.description as string || ''}
                                    onChange={e => updateField('description', e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 resize-none"
                                    rows={2}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Order</label>
                                <input
                                    type="number"
                                    value={formData.order as number || 0}
                                    onChange={e => updateField('order', parseInt(e.target.value))}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </>
                    )}

                    {type === 'stat' && (
                        <>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Value</label>
                                <input
                                    type="text"
                                    value={formData.value as string || ''}
                                    onChange={e => updateField('value', e.target.value)}
                                    placeholder="e.g. 2024 or 50+"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Label</label>
                                <input
                                    type="text"
                                    value={formData.label as string || ''}
                                    onChange={e => updateField('label', e.target.value)}
                                    placeholder="e.g. Founded or Projects"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Order</label>
                                <input
                                    type="number"
                                    value={formData.order as number || 0}
                                    onChange={e => updateField('order', parseInt(e.target.value))}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </>
                    )}

                    {type === 'content' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Section</label>
                                    <input
                                        type="text"
                                        value={formData.section as string || ''}
                                        onChange={e => updateField('section', e.target.value)}
                                        placeholder="e.g. hero, about"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-2">Key</label>
                                    <input
                                        type="text"
                                        value={formData.key as string || ''}
                                        onChange={e => updateField('key', e.target.value)}
                                        placeholder="e.g. headline, description"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Value</label>
                                <textarea
                                    value={formData.value as string || ''}
                                    onChange={e => updateField('value', e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 resize-none"
                                    rows={4}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 text-black px-4 py-3 rounded-lg font-medium hover:bg-cyan-400 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            {isEditing ? 'Save Changes' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
