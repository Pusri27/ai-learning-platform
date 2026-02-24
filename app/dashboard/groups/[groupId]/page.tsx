import { createClient } from '@/lib/auth';
import { redirect } from 'next/navigation';
import GroupChatClient from './GroupChatClient';

export default async function GroupChatPage({ params }: { params: { groupId: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    const { groupId } = params;

    // Verify membership
    const { data: membership } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single();

    if (!membership) {
        redirect('/dashboard/groups');
    }

    // Fetch group details
    const { data: group } = await supabase
        .from('study_groups')
        .select('*')
        .eq('id', groupId)
        .single();

    if (!group) {
        return <div>Group not found</div>;
    }

    return (
        <div className="h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex flex-col">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{group.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{group.description}</p>
                </div>
            </header>

            <div className="flex-1 overflow-hidden">
                <GroupChatClient groupId={groupId} userId={user.id} />
            </div>
        </div>
    );
}
