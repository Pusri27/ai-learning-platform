import { createClient } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    const supabase = await createClient();

    // Check admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { data: isAdminRpc } = await supabase.rpc('is_admin');
    if (!isAdminRpc) {
        return new Response('Forbidden', { status: 403 });
    }

    const formData = await request.formData();
    const courseId = formData.get('courseId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const level = formData.get('level') as string;
    const thumbnail = formData.get('thumbnail') as string;

    if (!courseId || !title || !description || !level) {
        return new Response('Missing required fields', { status: 400 });
    }

    const { error } = await supabase
        .from('courses')
        .update({
            title,
            description,
            level,
            thumbnail,
        })
        .eq('id', courseId);

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath('/admin/courses');
    redirect(`/admin/courses/${courseId}`);
}
