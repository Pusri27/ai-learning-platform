import { createClient } from '@/lib/auth';
import CourseCard from '@/components/CourseCard';
import { redirect } from 'next/navigation';

export default async function CoursesPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/auth/login');
    }

    const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        return <div>Error loading courses</div>;
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 py-10 transition-colors duration-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
                            All Courses
                        </h2>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {courses?.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
}
