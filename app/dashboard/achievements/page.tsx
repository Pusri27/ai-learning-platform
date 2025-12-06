import { createClient } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AchievementsList from '@/components/AchievementsList';

export default async function AchievementsPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/auth/login');
    }

    // Fetch all available achievements
    const { data: allAchievements } = await supabase
        .from('achievements')
        .select('*')
        .order('title');

    // Fetch user's unlocked achievements
    const { data: userUnlocked } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', session.user.id);

    // Merge data to determine status
    const achievements = allAchievements?.map(achievement => {
        const unlocked = userUnlocked?.find(ua => ua.achievement_id === achievement.id);
        return {
            ...achievement,
            unlocked_at: unlocked ? unlocked.unlocked_at : null
        };
    }) || [];

    // Sort: Unlocked first, then by title
    achievements.sort((a, b) => {
        const aUnlocked = !!a.unlocked_at;
        const bUnlocked = !!b.unlocked_at;
        if (aUnlocked && !bUnlocked) return -1;
        if (!aUnlocked && bUnlocked) return 1;
        return a.title.localeCompare(b.title);
    });

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10 transition-colors duration-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievements Gallery</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Track your milestones and unlock new badges as you master AI engineering.
                    </p>
                </div>

                <AchievementsList achievements={achievements} />
            </div>
        </div>
    );
}
