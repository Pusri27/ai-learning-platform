import { createClient } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Trophy, Target, TrendingUp, ArrowRight, CheckCircle, Clock } from 'lucide-react';

// Helper function to format relative time
function formatRelativeTime(timestamp: string): string {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }
    if (diffInSeconds < 172800) return 'Yesterday';
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) {
        const weeks = Math.floor(diffInSeconds / 604800);
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
    const months = Math.floor(diffInSeconds / 2592000);
    return months === 1 ? '1 month ago' : `${months} months ago`;
}

export default async function ProgressPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Fetch all courses
    const { data: courses } = await supabase
        .from('courses')
        .select('id, title, description, thumbnail, level');

    // Fetch user progress with completed_at for streak calculation
    const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('course_id, lesson_id, completed, updated_at')
        .eq('user_id', user.id);

    // Fetch total lessons per course
    const { data: allLessons } = await supabase
        .from('lessons')
        .select('course_id, id, title');

    // Fetch quiz results for accurate average score
    const { data: quizResults } = await supabase
        .from('quiz_results')
        .select('score')
        .eq('user_id', user.id);

    // Fetch user achievements (unlocked only)
    const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select(`
            unlocked_at,
            achievement:achievements (
                id,
                title,
                description,
                icon
            )
        `)
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false })
        .limit(3);

    // Fetch recent completed lessons for activity
    const { data: recentLessons } = await supabase
        .from('user_progress')
        .select(`
            updated_at,
            lesson:lessons (
                title
            )
        `)
        .eq('user_id', user.id)
        .eq('completed', true)
        .not('updated_at', 'is', null)
        .order('updated_at', { ascending: false })
        .limit(5);

    // Fetch recent quiz results for activity
    const { data: recentQuizzes } = await supabase
        .from('quiz_results')
        .select(`
            created_at,
            score,
            lesson:lessons (
                title
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

    // Fetch recent group joins for activity
    const { data: recentGroups } = await supabase
        .from('group_members')
        .select(`
            joined_at,
            group:groups (
                name
            )
        `)
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false })
        .limit(5);

    // Calculate Stats
    const totalCourses = courses?.length || 0;
    const totalLessonsCompleted = progress?.filter(p => p.completed).length || 0;

    // Calculate accurate average score from quiz_results
    const rawAverage = quizResults && quizResults.length > 0
        ? quizResults.reduce((acc, curr) => acc + curr.score, 0) / quizResults.length
        : 0;

    const averageScore = rawAverage % 1 === 0
        ? rawAverage.toString()
        : rawAverage.toFixed(2).replace(/\.?0+$/, '');

    // Calculate current streak
    let currentStreak = 0;
    if (progress && progress.length > 0) {
        const completedDates = progress
            .filter(p => p.completed && p.updated_at)
            .map(p => new Date(p.updated_at!).toDateString())
            .filter((date, index, self) => self.indexOf(date) === index) // unique dates
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // descending

        if (completedDates.length > 0) {
            const today = new Date().toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();

            // Check if user has activity today or yesterday
            if (completedDates[0] === today || completedDates[0] === yesterday) {
                currentStreak = 1;
                let checkDate = new Date(completedDates[0]);

                for (let i = 1; i < completedDates.length; i++) {
                    checkDate = new Date(checkDate.getTime() - 86400000); // go back 1 day
                    if (completedDates[i] === checkDate.toDateString()) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
            }
        }
    }

    // Combine and sort recent activities
    const activities: Array<{
        title: string;
        timestamp: string;
        type: 'lesson' | 'quiz' | 'group';
        metadata?: any;
    }> = [];

    recentLessons?.forEach(item => {
        const lessonData = item.lesson as any;
        if (lessonData && item.updated_at) {
            activities.push({
                title: `Completed "${lessonData.title}"`,
                timestamp: item.updated_at,
                type: 'lesson'
            });
        }
    });

    recentQuizzes?.forEach(item => {
        const lessonData = item.lesson as any;
        if (lessonData && item.created_at) {
            activities.push({
                title: `Scored ${item.score}/100 in "${lessonData.title}" Quiz`,
                timestamp: item.created_at,
                type: 'quiz',
                metadata: { score: item.score }
            });
        }
    });

    recentGroups?.forEach(item => {
        const groupData = item.group as any;
        if (groupData && item.joined_at) {
            activities.push({
                title: `Joined "${groupData.name}" Group`,
                timestamp: item.joined_at,
                type: 'group'
            });
        }
    });

    // Sort all activities by timestamp and limit to 10
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const recentActivities = activities.slice(0, 10);

    const courseProgress = courses?.map(course => {
        const courseLessons = allLessons?.filter(l => l.course_id === course.id) || [];
        const totalLessons = courseLessons.length;

        // Robust filtering: Check course_id match OR lookup via lesson_id
        const completedLessons = progress?.filter(p =>
            p.completed && (
                p.course_id === course.id ||
                allLessons?.find(l => l.id === p.lesson_id)?.course_id === course.id
            )
        ).length || 0;

        const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return {
            ...course,
            totalLessons,
            completedLessons,
            percentage
        };
    }) || [];

    // Sort by percentage descending to show most active first
    courseProgress.sort((a, b) => b.percentage - a.percentage);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 transition-colors duration-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Learning Journey</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Track your progress, achievements, and keep the momentum going!</p>

                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                    <StatsCard
                        title="Courses Enrolled"
                        value={totalCourses.toString()}
                        icon={<BookOpen className="h-6 w-6 text-indigo-600" />}
                        color="bg-indigo-50 dark:bg-indigo-900/20"
                    />
                    <StatsCard
                        title="Lessons Completed"
                        value={totalLessonsCompleted.toString()}
                        icon={<CheckCircle className="h-6 w-6 text-green-600" />}
                        color="bg-green-50 dark:bg-green-900/20"
                    />
                    <StatsCard
                        title="Average Score"
                        value={averageScore}
                        icon={<Target className="h-6 w-6 text-purple-600" />}
                        color="bg-purple-50 dark:bg-purple-900/20"
                    />
                    <StatsCard
                        title="Current Streak"
                        value={`${currentStreak} Day${currentStreak !== 1 ? 's' : ''}`}
                        icon={<TrendingUp className="h-6 w-6 text-orange-600" />}
                        color="bg-orange-50 dark:bg-orange-900/20"
                        subtext={currentStreak > 0 ? "Keep it up!" : "Start learning today!"}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Course Progress */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
                            <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                            Course Progress
                        </h2>

                        {/* Scrollable container for courses */}
                        <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2 scrollbar-hide">
                            {courseProgress.map((course) => (
                                <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md duration-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                                                {/* Use Next/Image in real app */}
                                                <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{course.level} • {course.completedLessons}/{course.totalLessons} Lessons</p>
                                            </div>
                                        </div>
                                        {course.percentage === 100 && (
                                            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                                                Completed
                                            </span>
                                        )}
                                    </div>

                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300">
                                                    {course.percentage}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200 dark:bg-gray-700">
                                            <div style={{ width: `${course.percentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"></div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Link
                                            href={`/dashboard/courses/${course.id}`}
                                            className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                                        >
                                            Continue Learning <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - Recent Activity & Achievements */}
                    <div className="space-y-8">
                        {/* Achievements */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                                Recent Achievements
                            </h2>
                            <div className="space-y-4">
                                {userAchievements && userAchievements.length > 0 ? (
                                    userAchievements.map((item, index) => {
                                        const achievement = item.achievement as any;
                                        return (
                                            <AchievementItem
                                                key={index}
                                                title={achievement?.title || 'Achievement'}
                                                description={achievement?.description || ''}
                                                date={formatRelativeTime(item.unlocked_at)}
                                                icon={achievement?.icon || '🏆'}
                                            />
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                        No achievements unlocked yet. Keep learning!
                                    </p>
                                )}
                            </div>
                            <Link
                                href="/dashboard/achievements"
                                className="w-full mt-4 block text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                            >
                                View All Achievements
                            </Link>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                                Recent Activity
                            </h2>
                            <div className="flow-root max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                                {recentActivities && recentActivities.length > 0 ? (
                                    <ul role="list" className="-mb-8">
                                        {recentActivities.map((activity, index) => (
                                            <ActivityItem
                                                key={index}
                                                title={activity.title}
                                                time={formatRelativeTime(activity.timestamp)}
                                                isLast={index === recentActivities.length - 1}
                                            />
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                        No recent activity. Start learning to see your progress here!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, color, subtext }: { title: string, value: string, icon: React.ReactNode, color: string, subtext?: string }) {
    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors duration-200">
            <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
                    {icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{title}</dt>
                        <dd>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{value}</div>
                            {subtext && <p className="text-xs text-green-600 mt-1">{subtext}</p>}
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    );
}

function AchievementItem({ title, description, date, icon }: { title: string, description: string, date: string, icon: string }) {
    return (
        <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-xl">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                <p className="text-xs text-gray-400 mt-0.5">{date}</p>
            </div>
        </div>
    );
}

function ActivityItem({ title, time, isLast }: { title: string, time: string, isLast: boolean }) {
    return (
        <li>
            <div className="relative pb-8">
                {!isLast && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>}
                <div className="relative flex space-x-3">
                    <div>
                        <span className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                        </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                            <time>{time}</time>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}
