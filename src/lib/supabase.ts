import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
export async function getAvailableSlots(date?: string) {
    let query = supabase
        .from('consultation_slots')
        .select('*')
        .eq('is_available', true);

    if (date) {
        query = query.eq('date', date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as ConsultationSlot[];
}

export async function bookSlot(id: string, name: string, email: string) {
    const { error } = await supabase
        .from('consultation_slots')
        .update({
            is_available: false,
            booked_by_name: name,
            booked_by_email: email
        })
        .eq('id', id);

    if (error) throw error;
}

export async function createSlot(date: string, time: string) {
    const { error } = await supabase
        .from('consultation_slots')
        .insert({ date, time, is_available: true });

    if (error) throw error;
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

