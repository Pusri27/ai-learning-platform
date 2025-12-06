import { generateQuiz } from '@/lib/ai/quizGenerator';
import { createClient } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { lessonId } = body;

        if (!lessonId) {
            return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
        }

        // Fetch lesson content
        const { data: lesson, error } = await supabase
            .from('lessons')
            .select('content')
            .eq('id', lessonId)
            .single();

        if (error || !lesson) {
            return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
        }

        const quiz = await generateQuiz(lesson.content);
        return NextResponse.json(quiz);
    } catch (error) {
        console.error('Error in quiz route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
