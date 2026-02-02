import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations
function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error('Missing Supabase configuration');
    }

    return createClient(url, key);
}

// Simple session verification using request cookies
function verifyAdminSession(request: NextRequest) {
    const sessionToken = request.cookies.get('admin_session')?.value;

    if (!sessionToken || !process.env.ADMIN_PASSWORD) return false;

    const expectedToken = Buffer.from(process.env.ADMIN_PASSWORD).toString('base64');
    return sessionToken === expectedToken;
}

// POST /api/admin - Login and Create operations
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password, action, resource, data } = body;

        // Login action (no auth required)
        if (action === 'login') {
            const envPassword = process.env.ADMIN_PASSWORD;
            console.log('Login attempt:', {
                receivedPasswordLength: password?.length,
                envPasswordExists: !!envPassword,
                envPasswordLength: envPassword?.length,
                passwordsMatch: password === envPassword
            });

            if (password === envPassword) {
                const token = Buffer.from(password).toString('base64');
                const response = NextResponse.json({ success: true });
                response.cookies.set('admin_session', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24, // 24 hours,
                });
                return response;
            }
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        // Logout action
        if (action === 'logout') {
            const response = NextResponse.json({ success: true });
            response.cookies.delete('admin_session');
            return response;
        }

        // All other actions require authentication
        const isAdmin = verifyAdminSession(request);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabaseAdmin = getSupabaseAdmin();

        // Create new record
        if (action === 'create') {
            switch (resource) {
                case 'testimonial': {
                    const { error, data: newData } = await supabaseAdmin
                        .from('testimonials')
                        .insert(data)
                        .select()
                        .single();
                    if (error) throw error;
                    return NextResponse.json(newData);
                }
                case 'showcase': {
                    const { error, data: newData } = await supabaseAdmin
                        .from('showcase_projects')
                        .insert(data)
                        .select()
                        .single();
                    if (error) throw error;
                    return NextResponse.json(newData);
                }
                case 'service': {
                    const { error, data: newData } = await supabaseAdmin
                        .from('services')
                        .insert(data)
                        .select()
                        .single();
                    if (error) throw error;
                    return NextResponse.json(newData);
                }
                case 'stat': {
                    const { error, data: newData } = await supabaseAdmin
                        .from('stats')
                        .insert(data)
                        .select()
                        .single();
                    if (error) throw error;
                    return NextResponse.json(newData);
                }
                case 'slot': {
                    const { error, data: newData } = await supabaseAdmin
                        .from('consultation_slots')
                        .insert(data)
                        .select()
                        .single();
                    if (error) throw error;
                    return NextResponse.json(newData);
                }
                case 'content': {
                    const { error, data: newData } = await supabaseAdmin
                        .from('site_content')
                        .insert(data)
                        .select()
                        .single();
                    if (error) throw error;
                    return NextResponse.json(newData);
                }
                default:
                    return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
            }
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Admin API error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// GET /api/admin - Get all admin data
export async function GET(request: NextRequest) {
    const isAdmin = verifyAdminSession(request);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource');

    try {
        const supabaseAdmin = getSupabaseAdmin();

        switch (resource) {
            case 'content': {
                const { data, error } = await supabaseAdmin.from('site_content').select('*').order('section');
                if (error) throw error;
                return NextResponse.json(data);
            }
            case 'testimonials': {
                const { data, error } = await supabaseAdmin.from('testimonials').select('*').order('order');
                if (error) throw error;
                return NextResponse.json(data);
            }
            case 'slots': {
                const { data, error } = await supabaseAdmin.from('consultation_slots').select('*').order('date');
                if (error) throw error;
                return NextResponse.json(data);
            }
            case 'submissions': {
                const { data, error } = await supabaseAdmin.from('form_submissions').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                return NextResponse.json(data);
            }
            case 'showcase': {
                const { data, error } = await supabaseAdmin.from('showcase_projects').select('*').order('order');
                if (error) throw error;
                return NextResponse.json(data);
            }
            case 'services': {
                const { data, error } = await supabaseAdmin.from('services').select('*').order('order');
                if (error) throw error;
                return NextResponse.json(data);
            }
            case 'stats': {
                const { data, error } = await supabaseAdmin.from('stats').select('*').order('order');
                if (error) throw error;
                return NextResponse.json(data);
            }
            case 'verify': {
                return NextResponse.json({ authenticated: true });
            }
            default:
                return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
        }
    } catch (error) {
        console.error('Admin API error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

// PUT /api/admin - Update resources
export async function PUT(request: NextRequest) {
    const isAdmin = verifyAdminSession(request);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { resource, id, data } = await request.json();
        const supabaseAdmin = getSupabaseAdmin();

        switch (resource) {
            case 'content': {
                const { error } = await supabaseAdmin
                    .from('site_content')
                    .update({ ...data, updated_at: new Date().toISOString() })
                    .eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }
            case 'testimonial': {
                const { error } = await supabaseAdmin
                    .from('testimonials')
                    .update(data)
                    .eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }
            case 'slot': {
                const { error } = await supabaseAdmin
                    .from('consultation_slots')
                    .update(data)
                    .eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }
            case 'submission': {
                const { error } = await supabaseAdmin
                    .from('form_submissions')
                    .update({ is_read: data.is_read })
                    .eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }
            case 'showcase': {
                const { error } = await supabaseAdmin
                    .from('showcase_projects')
                    .update(data)
                    .eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }
            case 'service': {
                const { error } = await supabaseAdmin
                    .from('services')
                    .update(data)
                    .eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }
            case 'stat': {
                const { error } = await supabaseAdmin
                    .from('stats')
                    .update(data)
                    .eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }
            default:
                return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
        }
    } catch (error) {
        console.error('Admin API error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

// DELETE /api/admin - Delete resources
export async function DELETE(request: NextRequest) {
    const isAdmin = verifyAdminSession(request);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { resource, id } = await request.json();
        const supabaseAdmin = getSupabaseAdmin();

        switch (resource) {
            case 'testimonial': {
                const { error } = await supabaseAdmin
                    .from('testimonials')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }
            case 'showcase': {
                const { error } = await supabaseAdmin
                    .from('showcase_projects')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }
            case 'service': {
                const { error } = await supabaseAdmin
                    .from('services')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }
            case 'stat': {
                const { error } = await supabaseAdmin
                    .from('stats')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }
            case 'slot': {
                const { error } = await supabaseAdmin
                    .from('consultation_slots')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }
            case 'submission': {
                const { error } = await supabaseAdmin
                    .from('form_submissions')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }
            case 'content': {
                const { error } = await supabaseAdmin
                    .from('site_content')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
                return NextResponse.json({ success: true });
            }
            default:
                return NextResponse.json({ error: 'Delete not supported for this resource' }, { status: 400 });
        }
    } catch (error) {
        console.error('Admin API error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
