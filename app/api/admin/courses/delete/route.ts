import { createClient } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const formData = await request.formData();
        const courseId = formData.get('courseId') as string;

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', courseId);

        if (error) throw error;

    } catch (error) {
        console.error('Error deleting course:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    redirect('/admin/courses');
}
