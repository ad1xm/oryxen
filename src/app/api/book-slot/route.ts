import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Atomic booking API endpoint.
 * Uses service role key to bypass RLS and perform atomic operations.
 * Prevents double-booking via conditional updates + unique constraint.
 */

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error('Missing Supabase configuration');
    }

    return createClient(url, key);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { date, time, name, email, phone, notes } = body;

        // --- Input validation ---
        if (!date || !time || !name || !email || !phone) {
            return NextResponse.json(
                { error: 'Missing required fields: date, time, name, email, phone', code: 'VALIDATION_ERROR' },
                { status: 400 }
            );
        }

        // Validate date format (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json(
                { error: 'Invalid date format. Use YYYY-MM-DD.', code: 'VALIDATION_ERROR' },
                { status: 400 }
            );
        }

        // Validate time format (HH:MM)
        if (!/^\d{2}:\d{2}$/.test(time)) {
            return NextResponse.json(
                { error: 'Invalid time format. Use HH:MM.', code: 'VALIDATION_ERROR' },
                { status: 400 }
            );
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format.', code: 'VALIDATION_ERROR' },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();

        // --- Step 1: Check if slot row already exists ---
        const { data: existingSlot, error: fetchError } = await supabase
            .from('consultation_slots')
            .select('*')
            .eq('date', date)
            .eq('time', time)
            .maybeSingle();

        if (fetchError) {
            console.error('Fetch slot error:', fetchError);
            return NextResponse.json(
                { error: 'Database error while checking slot.', code: 'DB_ERROR' },
                { status: 500 }
            );
        }

        // --- Step 2a: Slot exists and is already booked ---
        if (existingSlot && !existingSlot.is_available) {
            return NextResponse.json(
                { error: 'This slot has already been booked. Please choose another time.', code: 'ALREADY_BOOKED' },
                { status: 409 }
            );
        }

        // --- Step 2b: Slot exists and is available → atomic conditional update ---
        if (existingSlot && existingSlot.is_available) {
            const { data: updated, error: updateError } = await supabase
                .from('consultation_slots')
                .update({
                    is_available: false,
                    booked_by_name: name,
                    booked_by_email: email,
                    phone: phone,
                    booked_at: new Date().toISOString(),
                })
                .eq('id', existingSlot.id)
                .eq('is_available', true)  // Critical: only update if STILL available (race condition guard)
                .select()
                .single();

            if (updateError || !updated) {
                // Another user won the race between our SELECT and UPDATE
                return NextResponse.json(
                    { error: 'This slot was just booked by someone else. Please choose another time.', code: 'RACE_CONDITION' },
                    { status: 409 }
                );
            }

            return NextResponse.json({ success: true, slot: updated });
        }

        // --- Step 2c: Slot row doesn't exist → insert as booked ---
        const { data: inserted, error: insertError } = await supabase
            .from('consultation_slots')
            .insert({
                date,
                time,
                is_available: false,
                booked_by_name: name,
                booked_by_email: email,
                phone: phone,
                booked_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (insertError) {
            // Unique constraint violation = another user inserted the same (date, time) first
            if (insertError.code === '23505') {
                return NextResponse.json(
                    { error: 'This slot was just booked by someone else. Please choose another time.', code: 'RACE_CONDITION' },
                    { status: 409 }
                );
            }
            console.error('Insert slot error:', insertError);
            return NextResponse.json(
                { error: 'Database error while booking slot.', code: 'DB_ERROR' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, slot: inserted });

    } catch (error) {
        console.error('Book slot API error:', error);
        return NextResponse.json(
            { error: 'Internal server error.', code: 'SERVER_ERROR' },
            { status: 500 }
        );
    }
}
