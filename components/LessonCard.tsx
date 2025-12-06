import Link from 'next/link';
import { CheckCircle, Circle } from 'lucide-react';

interface LessonProps {
    id: string;
    title: string;
    order_index: number;
    completed: boolean;
    courseId: string;
}

export default function LessonCard({ lesson }: { lesson: LessonProps }) {
    return (
        <Link
            href={`/dashboard/courses/${lesson.courseId}/lesson/${lesson.id}`}
            className="block hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        >
            <div className="flex items-center px-4 py-4 sm:px-6 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="min-w-0 flex-1 flex items-center">
                    <div className="flex-shrink-0 mr-4">
                        {lesson.completed ? (
                            <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
                        ) : (
                            <Circle className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                        )}
                    </div>
                    <div>
                        <p className="truncate text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            Lesson {lesson.order_index}
                        </p>
                        <p className="mt-1 truncate text-sm text-gray-900 dark:text-white">{lesson.title}</p>
                    </div>
                </div>
                <div>
                    <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200">
                        Start
                    </span>
                </div>
            </div>
        </Link>
    );
}
