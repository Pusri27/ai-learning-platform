import { createClient } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();

    const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(courses);
}
