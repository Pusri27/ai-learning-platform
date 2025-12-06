import { createClient } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardClient from './DashboardClient';

export default async function Dashboard() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/auth/login');
    }

    // Fetch Total Courses (Available)
    const { count: totalCourses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

    // Fetch Lessons Completed
    const { count: lessonsCompleted } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('completed', true);

    // Fetch Average Quiz Score
    const { data: quizResults } = await supabase
        .from('quiz_results')
        .select('score')
        .eq('user_id', session.user.id);

    const rawAverage = quizResults && quizResults.length > 0
        ? quizResults.reduce((acc, curr) => acc + curr.score, 0) / quizResults.length
        : 0;

    // Format: show decimals only if needed (2 instead of 2.00, but 85.5 or 92.35)
    const averageScore = rawAverage % 1 === 0
        ? rawAverage.toString()
        : rawAverage.toFixed(2).replace(/\.?0+$/, '');

    // Fetch suggested courses (limit 3)
    const { data: courses } = await supabase.from('courses').select('*').limit(3);

    // Fetch Leaderboard (Top 5 by XP)
    const { data: leaderboard } = await supabase
        .from('profiles')
        .select('id, name, xp')
        .order('xp', { ascending: false })
        .limit(5);

    // Fetch User Achievements
    // We need all achievements, and mark which ones are unlocked
    const { data: allAchievements } = await supabase.from('achievements').select('*');
    const { data: unlockedAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', session.user.id);

    const achievements = allAchievements?.map(achievement => {
        const unlocked = unlockedAchievements?.find(ua => ua.achievement_id === achievement.id);
        return {
            ...achievement,
            unlocked_at: unlocked ? unlocked.unlocked_at : null
        };
    }) || [];

    return (
        <DashboardClient
            user={session.user}
            totalCourses={totalCourses || 0}
            lessonsCompleted={lessonsCompleted || 0}
            averageScore={averageScore}
            suggestedCourses={courses || []}
            leaderboard={leaderboard || []}
            achievements={achievements}
        />
    );
}

