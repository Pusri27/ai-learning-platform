'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

import { ThemeToggle } from '@/components/ThemeToggle';

interface NavbarProps {
    serverRole?: string | null;
}

export default function Navbar({ serverRole }: NavbarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    // Initialize isAdmin based on serverRole if available
    const [isAdmin, setIsAdmin] = useState(serverRole === 'admin');
    const [profileRole, setProfileRole] = useState<string | null>(serverRole || null);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session?.user) {
                // Try RPC first (Most reliable)
                const { data: isAdminRpc, error: rpcError } = await supabase.rpc('is_admin');

                // Fallback to table select if RPC fails or for debug info
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                // Since RLS is disabled, trust the profile table directly
                // RPC might be failing or caching old state

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    setFetchError(profileError.message);
                } else {
                    setFetchError(null);
                }

                setProfileRole(profile?.role);

                // LOGIC UPDATE: If profile says admin, IT IS ADMIN.
                // We use OR condition: if RPC says yes OR profile says yes.
                const isProfileAdmin = profile?.role === 'admin';
                const isRpcAdmin = !!isAdminRpc;

                console.log('Admin Check - Profile:', isProfileAdmin, 'RPC:', isRpcAdmin);

                setIsAdmin(isProfileAdmin || isRpcAdmin);
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                const { data: isAdminRpc } = await supabase.rpc('is_admin');
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (error) setFetchError(error.message);
                else setFetchError(null);

                setProfileRole(profile?.role);
                setIsAdmin(profile?.role === 'admin' || !!isAdminRpc);
            } else {
                setIsAdmin(false);
                setProfileRole(null);
                setFetchError(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleLogout = async () => {
        try {
            // Call server-side logout route
            await fetch('/auth/signout', {
                method: 'POST',
            });

            // Clear local state
            setUser(null);
            setIsAdmin(false);
            setProfileRole(null);

            // Force full reload to ensure all state/cookies are cleared
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            // Fallback redirect
            window.location.href = '/';
        }
    };

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                            <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 hover:opacity-80 transition-opacity">
                                AI Learn
                            </Link>
                        </div>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            {user && (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200 ${isActive('/dashboard')
                                            ? 'border-primary-500 text-gray-900 dark:text-white'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/dashboard/courses"
                                        className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200 ${isActive('/dashboard/courses')
                                            ? 'border-primary-500 text-gray-900 dark:text-white'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        Courses
                                    </Link>
                                    <Link
                                        href="/dashboard/tutor"
                                        className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200 ${isActive('/dashboard/tutor')
                                            ? 'border-primary-500 text-gray-900 dark:text-white'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        AI Tutor
                                    </Link>
                                    <Link
                                        href="/dashboard/progress"
                                        className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200 ${isActive('/dashboard/progress')
                                            ? 'border-primary-500 text-gray-900 dark:text-white'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        Progress
                                    </Link>
                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200 ${isActive('/admin')
                                                ? 'border-primary-500 text-primary-600'
                                                : 'border-transparent text-primary-600 hover:border-primary-300 hover:text-primary-800'
                                                }`}
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <ThemeToggle />
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.email}</span>
                                    <div className="flex flex-col text-xs text-right">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isAdmin
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                            }`}>
                                            {isAdmin ? 'Admin' : 'User'}
                                        </span>
                                        {fetchError && (
                                            <span className="text-red-500 text-[10px]">
                                                Err: {fetchError}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-full bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <Link
                                    href="/auth/login"
                                    className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
