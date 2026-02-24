'use client';

import { createClient } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function DebugAuthPage() {
    const supabase = createClient();
    const [session, setSession] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;
                // Note: user state in this debug page is still named 'session' and 'setSession' for UI consistency in the debug view, but fetching correctly now.
                setSession({ user });

                if (user) {
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (profileError) {
                        console.error('Profile Error:', profileError);
                        setError(profileError.message);
                    }
                    setProfile(profile);
                }
            } catch (err: any) {
                console.error('Auth Check Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [supabase]);

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Debug Auth & Permissions</h1>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="font-semibold mb-2">Session Status</h2>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                            {session ? 'Logged In' : 'Not Logged In'}
                        </pre>
                    </div>

                    {session && (
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <h2 className="font-semibold mb-2">User Details</h2>
                            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                                {JSON.stringify(session.user, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="font-semibold mb-2">Profile Data (DB)</h2>
                        {error ? (
                            <div className="text-red-600 bg-red-50 p-4 rounded">
                                Error fetching profile: {error}
                                <p className="mt-2 text-sm text-gray-600">
                                    Hint: Check RLS policies or if the row exists in 'profiles' table.
                                </p>
                            </div>
                        ) : (
                            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                                {profile ? JSON.stringify(profile, null, 2) : 'No profile found'}
                            </pre>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="font-semibold mb-2">Admin Check</h2>
                        <div className={`text-lg font-bold ${profile?.role === 'admin' ? 'text-green-600' : 'text-red-600'}`}>
                            Is Admin: {profile?.role === 'admin' ? 'YES' : 'NO'}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Role from DB: {profile?.role || 'undefined'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
