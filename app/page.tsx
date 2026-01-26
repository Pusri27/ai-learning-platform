import Link from "next/link";
import { createClient } from '@/lib/auth';
import { ArrowRight, BookOpen, Code2, Sparkles, Trophy, Zap, Users, Brain, Target, CheckCircle2, Star } from 'lucide-react';

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
                {/* Background decoration */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ai-200/30 dark:bg-ai-900/20 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Headline & CTA */}
                        <div className="space-y-8 animate-fade-in">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700">
                                <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                                    AI-Powered Learning Platform
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                                Master{' '}
                                <span className="text-gradient-learning">
                                    AI Engineering
                                </span>
                                {' '}Through Interactive Learning
                            </h1>

                            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                                Learn Python, Machine Learning, and Neural Networks with gamified lessons,
                                real-time code execution, and 24/7 AI tutoring. Make learning addictive.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {user ? (
                                    <Link href="/dashboard">
                                        <button className="btn btn-primary group">
                                            Go to Dashboard
                                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/auth/register">
                                            <button className="btn btn-primary group">
                                                Start Learning Free
                                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                            </button>
                                        </Link>
                                        <Link href="/auth/login">
                                            <button className="btn btn-outline">
                                                Sign In
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Trust indicators */}
                            <div className="flex items-center gap-8 pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-learning border-2 border-white dark:border-slate-900" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        1,000+ learners
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="w-4 h-4 fill-energy-400 text-energy-400" />
                                    ))}
                                    <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">
                                        4.9/5 rating
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Stats Card */}
                        <div className="relative animate-slide-in-right">
                            <div className="card p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-xl">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                                    <span className="text-sm font-mono text-slate-600 dark:text-slate-400">
                                        Live Platform Stats
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="text-5xl font-bold text-gradient-learning">
                                            50+
                                        </div>
                                        <div className="text-slate-600 dark:text-slate-300">
                                            Interactive Courses
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-200 dark:bg-slate-700" />

                                    <div className="space-y-2">
                                        <div className="text-5xl font-bold text-gradient-success">
                                            10,000+
                                        </div>
                                        <div className="text-slate-600 dark:text-slate-300">
                                            Lessons Completed
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-200 dark:bg-slate-700" />

                                    <div className="space-y-2">
                                        <div className="text-5xl font-bold text-gradient-ai">
                                            24/7
                                        </div>
                                        <div className="text-slate-600 dark:text-slate-300">
                                            AI Tutor Support
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <Zap className="w-4 h-4 text-energy-500" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Everything You Need to Succeed
                            </span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold">
                            Learn Faster with{' '}
                            <span className="text-gradient-learning">Modern Tools</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                            Our platform combines the best of gamification, interactive coding, and AI assistance
                            to create an engaging learning experience.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1: Code Playground */}
                        <div className="card-hover p-8 group">
                            <div className="w-14 h-14 rounded-xl bg-gradient-learning flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Code2 className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">
                                Interactive Code Playground
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">
                                Write and execute Python code directly in your browser with our Monaco-powered editor.
                                Get instant feedback and learn by doing.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Real-time code execution
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Syntax highlighting
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Instant output display
                                </li>
                            </ul>
                        </div>

                        {/* Feature 2: AI Tutor */}
                        <div className="card-hover p-8 group">
                            <div className="w-14 h-14 rounded-xl bg-gradient-ai flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Brain className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">
                                AI Personal Tutor
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">
                                Get personalized help 24/7 from our Gemini-powered AI tutor. Ask questions,
                                debug code, and understand complex concepts.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Available 24/7
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Context-aware responses
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Code debugging help
                                </li>
                            </ul>
                        </div>

                        {/* Feature 3: Gamification */}
                        <div className="card-hover p-8 group">
                            <div className="w-14 h-14 rounded-xl bg-gradient-energy flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Trophy className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">
                                Gamified Learning
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">
                                Stay motivated with XP points, level progression, achievements, and global leaderboards.
                                Make learning addictive.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    XP & level system
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Daily streaks
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Global leaderboard
                                </li>
                            </ul>
                        </div>

                        {/* Feature 4: Structured Curriculum */}
                        <div className="card-hover p-8 group">
                            <div className="w-14 h-14 rounded-xl bg-gradient-success flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">
                                Structured Curriculum
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">
                                Follow our carefully designed learning path from Python basics to advanced neural networks
                                and machine learning algorithms.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Beginner to advanced
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Clear learning path
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Progress tracking
                                </li>
                            </ul>
                        </div>

                        {/* Feature 5: Real-time Feedback */}
                        <div className="card-hover p-8 group">
                            <div className="w-14 h-14 rounded-xl bg-interactive-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">
                                Instant Feedback
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">
                                Get immediate quiz results, code validation, and performance insights.
                                Know exactly where you stand.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Instant quiz scoring
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Code validation
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Performance analytics
                                </li>
                            </ul>
                        </div>

                        {/* Feature 6: Community */}
                        <div className="card-hover p-8 group">
                            <div className="w-14 h-14 rounded-xl bg-community-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">
                                Learning Community
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">
                                Join study groups, participate in discussions, and learn from peers.
                                You're never alone on your learning journey.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Study groups
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Discussion forums
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                                    Peer learning
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Learning Path Section */}
            <section className="py-20 lg:py-32 bg-slate-100 dark:bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                            <div key={index} className="card p-8 relative overflow-hidden group hover:shadow-xl transition-all">
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
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <div className="card p-12 bg-gradient-to-br from-primary-600 to-ai-600 text-white shadow-2xl">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                            Ready to Start Your AI Journey?
                        </h2>
                        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of developers mastering AI engineering through interactive,
                            gamified learning. Start with our free courses today.
                        </p>

                        {!user && (
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/auth/register">
                                    <button className="btn bg-white text-primary-600 hover:bg-slate-50 shadow-lg">
                                        Get Started Free
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </Link>
                                <Link href="/auth/login">
                                    <button className="btn bg-primary-700/50 text-white border-2 border-white/30 hover:bg-primary-700">
                                        Sign In
                                    </button>
                                </Link>
                            </div>
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
                    </div>
                </div>
            </section>
        </div>
    );
}
