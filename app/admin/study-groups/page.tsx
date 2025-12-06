import { createClient } from '@/lib/auth';
import StudyGroupsTable from '@/components/admin/StudyGroupsTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Study Groups | AI Learning Platform',
    description: 'Manage study groups',
};

export const dynamic = 'force-dynamic';

export default async function AdminStudyGroupsPage() {
    const supabase = await createClient();
    const ITEMS_PER_PAGE = 10;

    // Get current user session
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch initial data (parallel requests)
    const [countResult, { data: groups }, { data: profile }] = await Promise.all([
        supabase
            .from('study_groups')
            .select('*', { count: 'exact', head: true }),
        supabase
            .from('study_groups')
            .select('*, profiles:created_by(name, email)')
            .order('created_at', { ascending: false })
            .range(0, ITEMS_PER_PAGE - 1),
        user ? supabase
            .from('profiles')
            .select('name, email')
            .eq('id', user.id)
            .single() : Promise.resolve({ data: null })
    ]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Study Group Management</h2>

            <StudyGroupsTable
                initialGroups={groups || [] as any}
                initialTotal={countResult.count || 0}
                currentUserProfile={profile}
            />
        </div>
    );
}
