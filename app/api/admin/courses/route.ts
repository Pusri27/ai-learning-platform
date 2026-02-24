import { createClient } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { title, description, level, image_url } = body;

        if (!title || !description || !level) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('courses')
            .insert({
                title,
                description,
                level,
                image_url
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, course: data });

    } catch (error) {
        console.error('Error creating course:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
