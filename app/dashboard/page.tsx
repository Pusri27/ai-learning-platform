import { createClient } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardClient from './DashboardClient';

export default async function Dashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Run all queries in parallel for faster loading
    const [
        { count: totalCourses },
        { count: lessonsCompleted },
        { data: quizResults },
        { data: courses },
        { data: leaderboard },
        { data: allAchievements },
        { data: unlockedAchievements }
    ] = await Promise.all([
        // Total Courses
        supabase.from('courses').select('*', { count: 'exact', head: true }),

        // Lessons Completed
        supabase.from('user_progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('completed', true),

        // Quiz Results
        supabase.from('quiz_results')
            .select('score')
            .eq('user_id', user.id),

        // Suggested Courses
        supabase.from('courses').select('*').limit(3),

        // Leaderboard
        supabase.from('profiles')
            .select('id, name, xp')
            .order('xp', { ascending: false })
            .limit(5),

        // All Achievements
        supabase.from('achievements').select('*'),

        // Unlocked Achievements
        supabase.from('user_achievements')
            .select('achievement_id, unlocked_at')
            .eq('user_id', user.id)
    ]);

    // Calculate average score
    const rawAverage = quizResults && quizResults.length > 0
        ? quizResults.reduce((acc, curr) => acc + curr.score, 0) / quizResults.length
        : 0;

    const averageScore = rawAverage % 1 === 0
        ? rawAverage.toString()
        : rawAverage.toFixed(2).replace(/\.?0+$/, '');

    // Merge achievements with unlock status
    const achievements = allAchievements?.map(achievement => {
        const unlocked = unlockedAchievements?.find(ua => ua.achievement_id === achievement.id);
        return {
            ...achievement,
            unlocked_at: unlocked ? unlocked.unlocked_at : null
        };
    }) || [];

    return (
        <DashboardClient
            user={user}
            totalCourses={totalCourses || 0}
            lessonsCompleted={lessonsCompleted || 0}
            averageScore={averageScore}
            suggestedCourses={courses || []}
            leaderboard={leaderboard || []}
            achievements={achievements}
        />
    );
}
