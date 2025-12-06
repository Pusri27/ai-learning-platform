import { createClient } from '@/lib/auth';
import { Users, BookOpen, FileText, Activity } from 'lucide-react';
import AdminCharts from './AdminCharts';

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // Fetch stats
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
    const { count: lessonCount } = await supabase.from('lessons').select('*', { count: 'exact', head: true });

    // Fetch data for charts
    const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: true });

    const { data: courses } = await supabase
        .from('courses')
        .select('level');

    // Process User Growth Data (Group by date)
    const userGrowthMap = new Map<string, number>();
    profiles?.forEach(profile => {
        const date = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        userGrowthMap.set(date, (userGrowthMap.get(date) || 0) + 1);
    });

    // Convert map to array and calculate cumulative growth
    let cumulativeCount = 0;
    const userGrowthData = Array.from(userGrowthMap.entries()).map(([date, count]) => {
        cumulativeCount += count;
        return { date, count: cumulativeCount };
    });

    // If no data, add a dummy point to show empty chart gracefully
    if (userGrowthData.length === 0) {
        userGrowthData.push({ date: 'Today', count: 0 });
    }

    // Process Course Distribution Data
    const courseLevelMap = new Map<string, number>();
    courses?.forEach(course => {
        const level = course.level || 'Unknown';
        courseLevelMap.set(level, (courseLevelMap.get(level) || 0) + 1);
    });

    const courseDistributionData = Array.from(courseLevelMap.entries()).map(([name, value]) => ({
        name,
        value
    }));

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Users */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                    <Users className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</dt>
                                    <dd>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{userCount || 0}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Courses */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</dt>
                                    <dd>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{courseCount || 0}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Lessons */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                                    <FileText className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Total Lessons</dt>
                                    <dd>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{lessonCount || 0}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Sessions (Mock) */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
                                    <Activity className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">System Status</dt>
                                    <dd>
                                        <div className="text-lg font-bold text-green-600 dark:text-green-400">Operational</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <AdminCharts
                userGrowthData={userGrowthData}
                courseDistributionData={courseDistributionData}
            />
        </div>
    );
}
