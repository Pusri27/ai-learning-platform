'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, CheckCircle, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface DashboardClientProps {
    user: any;
    totalCourses: number;
    lessonsCompleted: number;
    averageScore: string;
    suggestedCourses: any[];
    leaderboard: any[];
    achievements: any[];
}

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05 // Reduced from 0.1 for faster loading feel
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 10 }, // Reduced from y: 20 for subtler effect
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.2 // Faster animation
        }
    }
};

import Leaderboard from '@/components/Leaderboard';
import AchievementsList from '@/components/AchievementsList';
import CourseCard from '@/components/CourseCard';

export default function DashboardClient({
    user,
    totalCourses,
    lessonsCompleted,
    averageScore,
    suggestedCourses,
    leaderboard,
    achievements
}: DashboardClientProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-primary-100/40 blur-3xl animate-blob" />
                <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-secondary-100/40 blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-100/40 blur-3xl animate-blob animation-delay-4000" />
            </div>

            <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 flex items-center justify-between"
                    >
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-2">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">{user.user_metadata.name || 'Student'}</span>
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Ready to continue your journey into Artificial Intelligence?
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-10"
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 p-6 hover:shadow-lg transition-all duration-300 group">
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary-50 dark:bg-primary-900/20 blur-2xl group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors" />
                                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                                        <BookOpen className="h-4 w-4" />
                                    </div>
                                    Total Courses Available
                                </dt>
                                <dd className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{totalCourses}</dd>
                            </motion.div>

                            <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 p-6 hover:shadow-lg transition-all duration-300 group">
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-green-50 dark:bg-green-900/20 blur-2xl group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors" />
                                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                        <CheckCircle className="h-4 w-4" />
                                    </div>
                                    Lessons Completed
                                </dt>
                                <dd className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{lessonsCompleted}</dd>
                            </motion.div>

                            <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 p-6 hover:shadow-lg transition-all duration-300 group">
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-yellow-50 dark:bg-yellow-900/20 blur-2xl group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/30 transition-colors" />
                                <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                                        <Trophy className="h-4 w-4" />
                                    </div>
                                    Average Quiz Score
                                </dt>
                                <dd className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {averageScore}
                                </dd>
                            </motion.div>
                        </div>

                        {/* Gamification Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <AchievementsList achievements={achievements} />
                            </div>
                            <div>
                                <Leaderboard users={leaderboard} />
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <motion.div variants={item}>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary-500" />
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Link
                                    href="/dashboard/tutor"
                                    className="group relative flex items-center gap-4 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                        <span className="text-2xl">🤖</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white">Chat with AI Tutor</h3>
                                        <p className="text-indigo-100 text-sm">Get instant help with your studies</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-white/70 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href="/dashboard/courses"
                                    className="group relative flex items-center gap-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Browse Courses</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Explore new topics and skills</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform group-hover:text-primary-500" />
                                </Link>

                                <Link
                                    href="/dashboard/groups"
                                    className="group relative flex items-center gap-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Join Study Groups</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Connect with other learners</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform group-hover:text-purple-500 dark:group-hover:text-purple-400" />
                                </Link>

                                <Link
                                    href="/dashboard/playground"
                                    className="group relative flex items-center gap-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                        <span className="text-2xl">🐍</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Code Playground</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Practice Python online</p>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Suggested Courses */}
                        <motion.div variants={item}>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recommended for You</h2>
                                <Link href="/dashboard/courses" className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center gap-1 transition-colors">
                                    View all <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {suggestedCourses?.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
