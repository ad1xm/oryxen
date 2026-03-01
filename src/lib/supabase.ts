import { createClient } from '@supabase/supabase-js';

// Use safe fallbacks for build time to prevent crashes if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

if (typeof window !== "undefined" && supabaseUrl === "https://placeholder.supabase.co") {
    console.error("🚨 SUPABASE URL MISSING: Next.js did not bind environment variables. Please restart your dev server (npm run dev) so it can pick up your .env file!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface SiteContent {
    id: string;
    section: string;
    key: string;
    value: string;
    updated_at: string;
}

export interface ConsultationSlot {
    id: string;
    date: string;
    time: string;
    is_available: boolean;
    booked_by_name?: string;
    booked_by_email?: string;
    phone?: string;
    booked_at?: string;
    created_at: string;
}

export interface Testimonial {
    id: string;
    quote: string;
    name: string;
    role: string;
    location: string;
    is_visible: boolean;
    order: number;
    created_at: string;
}

export interface ShowcaseProject {
    id: string;
    category: string;
    title: string;
    description: string;
    type: string;
    order: number;
    is_visible: boolean;
    created_at: string;
    color?: string;
    details?: {
        headline: string;
        capabilities: string[];
        benefits: string[];
        stack: string[];
    };
}

export interface Stat {
    id: string;
    label: string;
    value: string;
    order: number;
    created_at: string;
}

export interface FormSubmission {
    id: string;
    type: string;
    name: string;
    email: string;
    company?: string;
    message: string;
    created_at: string;
    is_read: boolean;
}

// Content Management Functions
export async function getContent(section: string) {
    const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', section);

    if (error) throw error;
    return data as SiteContent[];
}

export async function updateContent(id: string, value: string) {
    const { error } = await supabase
        .from('site_content')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw error;
}

// Consultation Slots Functions

// Fetch slots via server API for reliable reads
export async function fetchSlotsForDate(date: string): Promise<ConsultationSlot[]> {
    const res = await fetch(`/api/slots?date=${encodeURIComponent(date)}`);
    if (!res.ok) {
        throw new Error('Failed to fetch slots');
    }
    const json = await res.json();
    return json.slots as ConsultationSlot[];
}

// Book a slot via server API (atomic, race-condition safe)
export async function bookSlotViaAPI(data: {
    date: string;
    time: string;
    name: string;
    email: string;
    phone: string;
    notes?: string;
}): Promise<{ success: boolean; error?: string; code?: string }> {
    const res = await fetch('/api/book-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
        return { success: false, error: json.error, code: json.code };
    }
    return { success: true };
}

// Keep legacy function for admin panel compatibility
export async function getAllSlotsForDate(date: string) {
    const { data, error } = await supabase
        .from('consultation_slots')
        .select('*')
        .eq('date', date)
        .order('time', { ascending: true });

    if (error) throw error;
    return data as ConsultationSlot[];
}

// Testimonials Functions
export async function getVisibleTestimonials() {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_visible', true)
        .order('order', { ascending: true });

    if (error) throw error;
    return data as Testimonial[];
}

export async function getAllTestimonials() {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order', { ascending: true });

    if (error) throw error;
    return data as Testimonial[];
}

export async function toggleTestimonialVisibility(id: string, isVisible: boolean) {
    const { error } = await supabase
        .from('testimonials')
        .update({ is_visible: isVisible })
        .eq('id', id);

    if (error) throw error;
}

// Showcase Projects Functions
export async function getVisibleShowcaseProjects() {
    const { data, error } = await supabase
        .from('showcase_projects')
        .select('*')
        .eq('is_visible', true)
        .order('order', { ascending: true });

    if (error) throw error;
    return data as ShowcaseProject[];
}

export async function getAllShowcaseProjects() {
    const { data, error } = await supabase
        .from('showcase_projects')
        .select('*')
        .order('order', { ascending: true });

    if (error) throw error;
    return data as ShowcaseProject[];
}

// Stats Functions
export async function getStats() {
    const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('order', { ascending: true });

    if (error) throw error;
    return data as Stat[];
}

// Form Submissions Functions
export async function saveFormSubmission(submission: Omit<FormSubmission, 'id' | 'created_at' | 'is_read'>) {
    const { error } = await supabase
        .from('form_submissions')
        .insert({ ...submission, is_read: false });

    if (error) throw error;
}

export async function getFormSubmissions() {
    const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as FormSubmission[];
}

export async function markSubmissionAsRead(id: string) {
    const { error } = await supabase
        .from('form_submissions')
        .update({ is_read: true })
        .eq('id', id);

    if (error) throw error;
}

