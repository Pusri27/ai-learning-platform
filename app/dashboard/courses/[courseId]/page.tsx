import { createClient } from '@/lib/auth';
import LessonCard from '@/components/LessonCard';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function CourseDetailPage({ params }: { params: { courseId: string } }) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/auth/login');
    }

    // Fetch course details
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', params.courseId)
        .single();

    if (courseError || !course) {
        return <div>Course not found</div>;
    }

    // Fetch lessons
    const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', params.courseId)
        .order('order_index', { ascending: true });

    // Fetch user progress for this course
    const { data: progress } = await supabase
        .from('user_progress')
        .select('lesson_id, completed')
        .eq('user_id', session.user.id)
        .eq('course_id', params.courseId);

    const completedLessonIds = new Set(progress?.filter(p => p.completed).map(p => p.lesson_id));

    return (
        <div className="bg-white dark:bg-gray-900 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="lg:flex lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol role="list" className="flex items-center space-x-4">
                                <li>
                                    <div>
                                        <Link href="/dashboard/courses" className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300">
                                            Courses
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 flex-shrink-0 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                        </svg>
                                        <span className="ml-4 text-sm font-medium text-gray-500 dark:text-gray-400">{course.title}</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                        <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
                            {course.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{course.description}</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">Lessons</h3>
                    <div className="overflow-hidden bg-white dark:bg-gray-800 shadow dark:shadow-none ring-1 ring-gray-200 dark:ring-gray-700 sm:rounded-md">
                        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                            {lessons?.map((lesson) => (
                                <li key={lesson.id}>
                                    <LessonCard
                                        lesson={{
                                            ...lesson,
                                            completed: completedLessonIds.has(lesson.id),
                                            courseId: params.courseId
                                        }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
