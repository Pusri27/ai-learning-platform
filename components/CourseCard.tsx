'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CourseProps {
    id: string;
    title: string;
    description: string;
    level: string;
    thumbnail: string;
}

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function CourseCard({ course }: { course: CourseProps }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 transition-all duration-300 hover:shadow-xl hover:ring-indigo-100 dark:hover:ring-indigo-500"
        >
            <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                {course.thumbnail && course.thumbnail.startsWith('http') ? (
                    <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <span className="text-5xl font-bold text-indigo-200 dark:text-indigo-600 select-none">
                            {course.title.substring(0, 2)}
                        </span>
                    </div>
                )}
                <div className="absolute top-4 left-4 z-10">
                    <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset backdrop-blur-md bg-white/50",
                        course.level === 'Beginner' ? "text-green-700 ring-green-600/20" :
                            course.level === 'Intermediate' ? "text-yellow-700 ring-yellow-600/20" :
                                "text-red-700 ring-red-600/20"
                    )}>
                        {course.level}
                    </span>
                </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {course.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                        {course.description}
                    </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-700">
                    <Link
                        href={`/dashboard/courses/${course.id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 dark:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 group-hover:shadow-indigo-200 dark:group-hover:shadow-indigo-500/30 group-hover:shadow-lg"
                    >
                        Start Learning <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
