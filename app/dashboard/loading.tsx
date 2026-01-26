'use client';

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-8 animate-pulse">
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card p-6 animate-pulse">
                            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                    ))}
                </div>

                {/* Content Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="card p-6 animate-pulse">
                                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                                    <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-6">
                        <div className="card p-6 animate-pulse">
                            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
