'use client';

import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Sparkles, Trophy, Zap, Users, Brain, Target, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export default function Home() {
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const fadeInScale = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
                {/* Animated Background decoration */}
                <div className="absolute inset-0 -z-10">
                    <motion.div
                        className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl"
                        animate={{
                            y: [0, -30, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-0 right-1/4 w-96 h-96 bg-ai-200/30 dark:bg-ai-900/20 rounded-full blur-3xl"
                        animate={{
                            y: [0, 30, 0],
                            scale: [1, 1.15, 1],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Headline & CTA */}
                        <motion.div
                            className="space-y-8"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                </motion.div>
                                <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                                    AI-Powered Learning Platform
                                </span>
                            </motion.div>

                            <motion.h1
                                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                Master{' '}
                                <span className="text-gradient-learning">
                                    AI Engineering
                                </span>
                                {' '}Through Interactive Learning
                            </motion.h1>

                            <motion.p
                                className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                Learn Python, Machine Learning, and Neural Networks with gamified lessons,
                                real-time code execution, and 24/7 AI tutoring. Make learning addictive.
                            </motion.p>

                            <motion.div
                                className="flex flex-wrap gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                            >
                                {user ? (
                                    <Link href="/dashboard">
                                        <motion.button
                                            className="btn btn-primary group"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Go to Dashboard
                                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        </motion.button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/auth/register">
                                            <motion.button
                                                className="btn btn-primary group"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Start Learning Free
                                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                            </motion.button>
                                        </Link>
                                        <Link href="/auth/login">
                                            <motion.button
                                                className="btn btn-outline"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Sign In
                                            </motion.button>
                                        </Link>
                                    </>
                                )}
                            </motion.div>

                            {/* Trust indicators */}
                            <motion.div
                                className="flex items-center gap-8 pt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9, duration: 0.8 }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="w-8 h-8 rounded-full bg-gradient-learning border-2 border-white dark:border-slate-900"
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.9 + (i * 0.1), duration: 0.3 }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        1,000+ learners
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                            transition={{ delay: 1.1 + (i * 0.05), duration: 0.3 }}
                                        >
                                            <Star className="w-4 h-4 fill-energy-400 text-energy-400" />
                                        </motion.div>
                                    ))}
                                    <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">
                                        4.9/5 rating
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right: Stats Card */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            <motion.div
                                className="card p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-xl"
                                whileHover={{ scale: 1.02, y: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <motion.div
                                        className="w-2 h-2 rounded-full bg-success-500"
                                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <span className="text-sm font-mono text-slate-600 dark:text-slate-400">
                                        Live Platform Stats
                                    </span>
                                </div>

                                <motion.div
                                    className="space-y-6"
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <motion.div className="space-y-2" variants={fadeInScale}>
                                        <div className="text-5xl font-bold text-gradient-learning">
                                            50+
                                        </div>
                                        <div className="text-slate-600 dark:text-slate-300">
                                            Interactive Courses
                                        </div>
                                    </motion.div>

                                    <div className="h-px bg-slate-200 dark:bg-slate-700" />

                                    <motion.div className="space-y-2" variants={fadeInScale}>
                                        <div className="text-5xl font-bold text-gradient-success">
                                            10,000+
                                        </div>
                                        <div className="text-slate-600 dark:text-slate-300">
                                            Lessons Completed
                                        </div>
                                    </motion.div>

                                    <div className="h-px bg-slate-200 dark:bg-slate-700" />

                                    <motion.div className="space-y-2" variants={fadeInScale}>
                                        <div className="text-5xl font-bold text-gradient-ai">
                                            24/7
                                        </div>
                                        <div className="text-slate-600 dark:text-slate-300">
                                            AI Tutor Support
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16 space-y-4"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Zap className="w-4 h-4 text-energy-500" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Everything You Need to Succeed
                            </span>
                        </motion.div>
                        <h2 className="text-4xl sm:text-5xl font-bold">
                            Learn Faster with{' '}
                            <span className="text-gradient-learning">Modern Tools</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                            Our platform combines the best of gamification, interactive coding, and AI assistance
                            to create an engaging learning experience.
                        </p>
                    </motion.div>

                    {/* Feature Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {[
                            {
                                icon: Code2,
                                title: "Interactive Code Playground",
                                description: "Write and execute Python code directly in your browser with our Monaco-powered editor. Get instant feedback and learn by doing.",
                                gradient: "gradient-learning",
                                features: ["Real-time code execution", "Syntax highlighting", "Instant output display"]
                            },
                            {
                                icon: Brain,
                                title: "AI Personal Tutor",
                                description: "Get personalized help 24/7 from our Gemini-powered AI tutor. Ask questions, debug code, and understand complex concepts.",
                                gradient: "gradient-ai",
                                features: ["Available 24/7", "Context-aware responses", "Code debugging help"]
                            },
                            {
                                icon: Trophy,
                                title: "Gamified Learning",
                                description: "Stay motivated with XP points, level progression, achievements, and global leaderboards. Make learning addictive.",
                                gradient: "gradient-energy",
                                features: ["XP & level system", "Daily streaks", "Global leaderboard"]
                            },
                            {
                                icon: BookOpen,
                                title: "Structured Curriculum",
                                description: "Follow our carefully designed learning path from Python basics to advanced neural networks and machine learning algorithms.",
                                gradient: "gradient-success",
                                features: ["Beginner to advanced", "Clear learning path", "Progress tracking"]
                            },
                            {
                                icon: Zap,
                                title: "Instant Feedback",
                                description: "Get immediate quiz results, code validation, and performance insights. Know exactly where you stand.",
                                gradient: "interactive-400",
                                features: ["Instant quiz scoring", "Code validation", "Performance analytics"]
                            },
                            {
                                icon: Users,
                                title: "Learning Community",
                                description: "Join study groups, participate in discussions, and learn from peers. You're never alone on your learning journey.",
                                gradient: "community-500",
                                features: ["Study groups", "Discussion forums", "Peer learning"]
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="card-hover p-8 group"
                                variants={fadeInUp}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            >
                                <motion.div
                                    className={`w-14 h-14 rounded-xl bg-${feature.gradient} flex items-center justify-center mb-6`}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <feature.icon className="w-7 h-7 text-white" />
                                </motion.div>
                                <h3 className="text-2xl font-bold mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-4">
                                    {feature.description}
                                </p>
                                <ul className="space-y-2">
                                    {feature.features.map((item, i) => (
                                        <motion.li
                                            key={i}
                                            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.1 * i }}
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-success-500" />
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Learning Path Section */}
            <section className="py-20 lg:py-32 bg-slate-100 dark:bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16 space-y-4"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <Target className="w-4 h-4 text-primary-500" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Your Learning Journey
                            </span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold">
                            From Beginner to{' '}
                            <span className="text-gradient-success">AI Expert</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                            Our structured curriculum takes you step-by-step from Python fundamentals
                            to building real AI applications.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {[
                            {
                                step: '01',
                                title: 'Python Fundamentals',
                                description: 'Master Python syntax, data structures, and programming concepts',
                                color: 'primary'
                            },
                            {
                                step: '02',
                                title: 'Machine Learning',
                                description: 'Learn algorithms, models, and practical ML applications',
                                color: 'ai'
                            },
                            {
                                step: '03',
                                title: 'Neural Networks',
                                description: 'Build and train deep learning models from scratch',
                                color: 'success'
                            }
                        ].map((phase, index) => (
                            <motion.div
                                key={index}
                                className="card p-8 relative overflow-hidden group"
                                variants={fadeInUp}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className={`absolute top-0 right-0 text-9xl font-bold opacity-5 -mt-4 -mr-4 text-${phase.color}-500`}>
                                    {phase.step}
                                </div>
                                <div className={`text-sm font-mono font-bold text-${phase.color}-600 dark:text-${phase.color}-400 mb-4`}>
                                    STEP {phase.step}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">
                                    {phase.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    {phase.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div
                        className="card p-12 bg-gradient-to-br from-primary-600 to-ai-600 text-white shadow-2xl"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                            Ready to Start Your AI Journey?
                        </h2>
                        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of developers mastering AI engineering through interactive,
                            gamified learning. Start with our free courses today.
                        </p>

                        {!user && (
                            <motion.div
                                className="flex flex-wrap justify-center gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                <Link href="/auth/register">
                                    <motion.button
                                        className="btn bg-white text-primary-600 hover:bg-slate-50 shadow-lg"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Get Started Free
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                                <Link href="/auth/login">
                                    <motion.button
                                        className="btn bg-primary-700/50 text-white border-2 border-white/30 hover:bg-primary-700"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Sign In
                                    </motion.button>
                                </Link>
                            </motion.div>
                        )}

                        <div className="mt-8 flex items-center justify-center gap-8 text-sm text-primary-100">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                No credit card required
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                Free forever plan
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
