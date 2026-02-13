import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Slots availability API.
 * Returns all slots for a given date so the frontend can show green/red status.
 * Uses service role key for reliable reads.
 */

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error('Missing Supabase configuration');
    }

    return createClient(url, key);
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');

        if (!date) {
            return NextResponse.json(
                { error: 'Missing required parameter: date' },
                { status: 400 }
            );
        }

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json(
                { error: 'Invalid date format. Use YYYY-MM-DD.' },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();

        const { data, error } = await supabase
            .from('consultation_slots')
            .select('id, date, time, is_available, created_at, booked_at')
            .eq('date', date)
            .order('time', { ascending: true });

        if (error) {
            console.error('Fetch slots error:', error);
            return NextResponse.json(
                { error: 'Database error while fetching slots.' },
                { status: 500 }
            );
        }

        // Don't expose booker PII — only return availability data
        return NextResponse.json({
            date,
            slots: data || [],
        });

    } catch (error) {
        console.error('Slots API error:', error);
        return NextResponse.json(
            { error: 'Internal server error.' },
            { status: 500 }
        );
    }
}
