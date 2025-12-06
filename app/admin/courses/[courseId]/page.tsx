import { createClient } from '@/lib/auth';
import Link from 'next/link';
import { Plus, Edit, ArrowLeft, BookOpen, Clock } from 'lucide-react';
import DeleteLessonButton from './DeleteLessonButton';

export default async function AdminCourseDetailsPage({ params }: { params: { courseId: string } }) {
    const supabase = await createClient();
    const { courseId } = params;

    // Fetch course details
    const { data: course } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

    // Fetch lessons
    const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <Link
                    href="/admin/courses"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Courses
                </Link>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h2>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/courses/${courseId}/edit`}
                            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Course
                        </Link>
                        <Link
                            href={`/admin/courses/${courseId}/lessons/new`}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lesson
                        </Link>
                    </div>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl">{course.description}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {lessons?.length || 0} Lessons
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.level === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {course.level}
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Lessons</h3>
                </div>

                {lessons && lessons.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">Order</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {lessons.map((lesson) => (
                                <tr key={lesson.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {lesson.order_index}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{lesson.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/courses/${courseId}/lessons/${lesson.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <DeleteLessonButton lessonId={lesson.id} courseId={courseId} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No lessons found for this course.</p>
                        <Link
                            href={`/admin/courses/${courseId}/lessons/new`}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Lesson
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
