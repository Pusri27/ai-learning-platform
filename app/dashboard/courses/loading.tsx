'use client';

export default function CoursesLoading() {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 py-10 transition-colors duration-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-8 animate-pulse">
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>

                {/* Course Cards Skeleton */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="card p-6 animate-pulse">
                            <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4"></div>
                            <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                            <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                            <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
