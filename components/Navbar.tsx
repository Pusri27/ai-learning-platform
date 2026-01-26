'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GraduationCap, LogOut } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session?.user) {
                const { data: isAdminRpc } = await supabase.rpc('is_admin');
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                setIsAdmin(profile?.role === 'admin' || !!isAdminRpc);
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                const { data: isAdminRpc } = await supabase.rpc('is_admin');
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                setIsAdmin(profile?.role === 'admin' || !!isAdminRpc);
            } else {
                setIsAdmin(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleLogout = async () => {
        try {
            await fetch('/auth/signout', { method: 'POST' });
            setUser(null);
            setIsAdmin(false);
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/';
        }
    };

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-lg bg-gradient-learning flex items-center justify-center shadow-md">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-slate-900 dark:text-white">AI Learn</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {user && (
                            <>
                                <Link
                                    href="/dashboard"
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/dashboard')
                                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/courses"
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/dashboard/courses')
                                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    Courses
                                </Link>
                                <Link
                                    href="/dashboard/tutor"
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/dashboard/tutor')
                                        ? 'bg-ai-100 dark:bg-ai-900/30 text-ai-700 dark:text-ai-300'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    AI Tutor
                                </Link>
                                <Link
                                    href="/dashboard/progress"
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/dashboard/progress')
                                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    Progress
                                </Link>
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/admin')
                                            ? 'bg-community-100 dark:bg-community-900/30 text-community-700 dark:text-community-300'
                                            : 'text-community-600 dark:text-community-400 hover:bg-community-50 dark:hover:bg-community-900/20'
                                            }`}
                                    >
                                        Admin
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {user ? (
                            <div className="flex items-center gap-3">
                                {isAdmin && (
                                    <div className="hidden sm:block px-3 py-1 rounded-full bg-community-100 dark:bg-community-900/30 text-community-700 dark:text-community-300 text-xs font-semibold">
                                        Admin
                                    </div>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/auth/login">
                                    <button className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        Login
                                    </button>
                                </Link>
                                <Link href="/auth/register">
                                    <button className="btn btn-primary">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
