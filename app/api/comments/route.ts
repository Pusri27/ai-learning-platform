import { createClient } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
        return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: comments, error } = await supabase
        .from('comments')
        .select(`
            id,
            content,
            created_at,
            user_id,
            profiles (name)
        `)
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comments });
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { lessonId, content } = await request.json();

        if (!lessonId || !content) {
            return NextResponse.json({ error: 'Lesson ID and content are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('comments')
            .insert({
                user_id: session.user.id,
                lesson_id: lessonId,
                content
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, comment: data });
    } catch (error) {
        console.error('Error posting comment:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
