import { createClient } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import LessonClient from './LessonClient';

export default async function LessonPage({ params }: { params: { courseId: string; lessonId: string } }) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/auth/login');
    }

    // Fetch lesson data
    const { data: lesson } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', params.lessonId)
        .single();

    if (!lesson) {
        notFound();
    }

    // Fetch all lessons for navigation
    const { data: allLessons } = await supabase
        .from('lessons')
        .select('id, order_index')
        .eq('course_id', params.courseId)
        .order('order_index', { ascending: true });

    let prevLessonId: string | undefined;
    let nextLessonId: string | undefined;

    if (allLessons && lesson) {
        const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
        if (currentIndex > 0) {
            prevLessonId = allLessons[currentIndex - 1].id;
        }
        if (currentIndex < allLessons.length - 1) {
            nextLessonId = allLessons[currentIndex + 1].id;
        }
    }

    // Check if completed
    let initialCompleted = false;
    const { data: progress } = await supabase
        .from('user_progress')
        .select('completed')
        .eq('user_id', session.user.id)
        .eq('lesson_id', params.lessonId)
        .single();

    if (progress?.completed) {
        initialCompleted = true;
    }

    return (
        <LessonClient
            lesson={lesson}
            initialCompleted={initialCompleted}
            courseId={params.courseId}
            lessonId={params.lessonId}
            prevLessonId={prevLessonId}
            nextLessonId={nextLessonId}
        />
    );
}
