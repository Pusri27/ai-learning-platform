import { createClient } from '@/lib/auth';

export default async function DebugServerPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    let profile = null;
    let profileError = null;
    let rpcResult = null;

    if (user) {
        const profileQuery = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        profile = profileQuery.data;
        profileError = profileQuery.error;

        const rpcQuery = await supabase.rpc('is_admin');
        rpcResult = rpcQuery.data;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Server-Side Debug (Absolute Truth)</h1>

            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Auth User</h2>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto text-sm dark:text-gray-300">
                        {user ? JSON.stringify({ id: user.id, email: user.email }, null, 2) : 'Not Logged In'}
                    </pre>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Profile Data (Direct DB Fetch)</h2>
                    {profileError ? (
                        <div className="text-red-600 bg-red-50 dark:bg-red-900/30 p-4 rounded">
                            Error: {profileError.message}
                        </div>
                    ) : (
                        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto text-sm dark:text-gray-300">
                            {profile ? JSON.stringify(profile, null, 2) : 'No profile found'}
                        </pre>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">RPC Check (is_admin)</h2>
                    <div className={`text-lg font-bold ${rpcResult ? 'text-green-600' : 'text-red-600'}`}>
                        Result: {rpcResult === true ? 'TRUE (Admin)' : 'FALSE (Not Admin)'}
                    </div>
                </div>
            </div>
        </div>
    );
}
