import { createClient } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, MessageCircle } from 'lucide-react';

export default async function StudyGroupsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Fetch all groups
    const { data: groups } = await supabase
        .from('study_groups')
        .select('*')
        .order('created_at', { ascending: false });

    // Fetch groups user has joined
    const { data: memberships } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

    const joinedGroupIds = new Set(memberships?.map(m => m.group_id));

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10 transition-colors duration-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
                            Study Groups
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Join a community of learners and discuss topics together.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {groups?.map((group) => {
                        const isJoined = joinedGroupIds.has(group.id);
                        return (
                            <div key={group.id} className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                                    <Users className="h-6 w-6" />
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{group.name}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                            {group.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                                    {isJoined ? (
                                        <Link
                                            href={`/dashboard/groups/${group.id}`}
                                            className="flex w-full items-center justify-center rounded-md bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                                        >
                                            <MessageCircle className="mr-2 h-4 w-4" />
                                            Open Chat
                                        </Link>
                                    ) : (
                                        <form action="/api/groups/join" method="POST">
                                            <input type="hidden" name="groupId" value={group.id} />
                                            <button
                                                type="submit"
                                                className="flex w-full items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                                            >
                                                Join Group
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
