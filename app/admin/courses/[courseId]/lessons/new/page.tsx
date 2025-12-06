import { createClient } from '@/lib/auth';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewLessonPage({ params }: { params: { courseId: string } }) {
    const { courseId } = params;
    const supabase = await createClient();

    // Fetch course to confirm it exists and get title
    const { data: course } = await supabase
        .from('courses')
        .select('title')
        .eq('id', courseId)
        .single();

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    href={`/admin/courses/${courseId}`}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Course
                </Link>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Lesson to {course.title}</h2>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <form action="/api/admin/lessons" method="POST" className="space-y-6">
                    <input type="hidden" name="courseId" value={courseId} />

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Lesson Title
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                                placeholder="e.g. Introduction to Neural Networks"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="orderIndex" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Order Index
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="orderIndex"
                                id="orderIndex"
                                required
                                defaultValue={1}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                            />
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Determines the order of lessons in the course.</p>
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Content (Markdown)
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="content"
                                name="content"
                                rows={10}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 font-mono"
                                placeholder="# Lesson Content..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link
                            href={`/admin/courses/${courseId}`}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Create Lesson
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
