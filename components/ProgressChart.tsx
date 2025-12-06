interface CourseProgress {
    title: string;
    totalLessons: number;
    completedLessons: number;
}

export default function ProgressChart({ progress }: { progress: CourseProgress[] }) {
    return (
        <div className="space-y-6">
            {progress.map((course, index) => {
                const percentage = course.totalLessons > 0
                    ? Math.round((course.completedLessons / course.totalLessons) * 100)
                    : 0;

                return (
                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-white">{course.title}</span>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
                            {course.completedLessons} / {course.totalLessons} lessons
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
