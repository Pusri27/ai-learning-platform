import { createClient } from '@/lib/auth';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditCoursePage({ params }: { params: { courseId: string } }) {
    const { courseId } = params;
    const supabase = await createClient();

    // Fetch course details
    const { data: course } = await supabase
        .from('courses')
        .select('*')
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Course</h2>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <form action="/api/admin/courses/update" method="POST" className="space-y-6">
                    <input type="hidden" name="courseId" value={courseId} />

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Course Title
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                defaultValue={course.title}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="level" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Level
                        </label>
                        <div className="mt-2">
                            <select
                                id="level"
                                name="level"
                                required
                                defaultValue={course.level}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Description
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                required
                                defaultValue={course.description}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="thumbnail" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Thumbnail URL
                        </label>
                        <div className="mt-2">
                            <input
                                type="url"
                                name="thumbnail"
                                id="thumbnail"
                                required
                                defaultValue={course.thumbnail}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
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
                            Update Course
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
