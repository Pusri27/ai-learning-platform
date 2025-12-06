import { createClient } from '@/lib/auth';
import UsersTable from '@/components/admin/UsersTable';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const supabase = await createClient();
    const ITEMS_PER_PAGE = 10;

    // Get current user session
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch initial data (parallel requests)
    const [countResult, { data: users }] = await Promise.all([
        supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true }),
        supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .range(0, ITEMS_PER_PAGE - 1)
    ]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">User Management</h2>

            <UsersTable
                initialUsers={users || []}
                initialTotal={countResult.count || 0}
                currentUserId={user?.id || null}
            />
        </div>
    );
}
