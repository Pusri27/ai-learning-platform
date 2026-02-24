import { createClient } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user progress
    const { data: progress, error } = await supabase
        .from('user_progress')
        .select(`
      *,
      course:courses(title),
      lesson:lessons(title)
    `)
        .eq('user_id', user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(progress);
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { courseId, lessonId, completed, score, answers } = body;

        if (!courseId || !lessonId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Upsert progress
        const { error: progressError } = await supabase
            .from('user_progress')
            .upsert({
                user_id: user.id,
                course_id: courseId,
                lesson_id: lessonId,
                completed: completed || false,
                score: score,
                updated_at: new Date().toISOString(),
            });

        if (progressError) throw progressError;

        // If score is provided, save to quiz_results too
        if (score !== undefined) {
            const { error: resultError } = await supabase
                .from('quiz_results')
                .insert({
                    user_id: user.id,
                    course_id: courseId,
                    lesson_id: lessonId,
                    score: score,
                    answers: answers || {},
                });

            if (resultError) throw resultError;
        }

        // Calculate XP
        // Base XP for completing a lesson: 10
        // Bonus XP for quiz score: score * 10
        let xpGained = 0;
        if (completed) xpGained += 10;
        if (score) xpGained += (score * 10);

        // Update User XP
        if (xpGained > 0) {
            const { error: xpError } = await supabase.rpc('increment_xp', {
                user_id_input: user.id,
                xp_amount: xpGained
            });

            // Fallback if RPC doesn't exist (for now, we'll do a read-update-write or just ignore race conditions for MVP)
            if (xpError) {
                const { data: profile } = await supabase.from('profiles').select('xp').eq('id', user.id).single();
                const currentXp = profile?.xp || 0;
                await supabase.from('profiles').update({ xp: currentXp + xpGained }).eq('id', user.id);
            }
        }

        // Check for Achievements (Simplified Logic)
        // 1. Fetch user stats
        const { count: lessonCount } = await supabase
            .from('user_progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('completed', true);

        const { data: profile } = await supabase.from('profiles').select('xp').eq('id', user.id).single();
        const currentXp = profile?.xp || 0;

        // 2. Fetch all achievements
        const { data: allAchievements } = await supabase.from('achievements').select('*');

        // 3. Check each achievement
        if (allAchievements) {
            for (const achievement of allAchievements) {
                let unlocked = false;
                if (achievement.condition_type === 'lesson_count' && (lessonCount || 0) >= achievement.condition_value) unlocked = true;
                if (achievement.condition_type === 'total_xp' && currentXp >= achievement.condition_value) unlocked = true;
                if (achievement.condition_type === 'quiz_score' && score !== undefined && score >= achievement.condition_value) unlocked = true;

                if (unlocked) {
                    await supabase.from('user_achievements').upsert({
                        user_id: user.id,
                        achievement_id: achievement.id
                    }, { onConflict: 'user_id, achievement_id', ignoreDuplicates: true });
                }
            }
        }

        return NextResponse.json({ success: true, xpGained });
    } catch (error) {
        console.error('Error saving progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
