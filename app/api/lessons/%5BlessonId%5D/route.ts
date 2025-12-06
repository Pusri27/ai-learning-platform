import { createClient } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { lessonId: string } }) {
    const supabase = await createClient();

    const { data: lesson, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', params.lessonId)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!lesson) {
        return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json(lesson);
}
