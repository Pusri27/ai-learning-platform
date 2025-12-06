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
    const lessonId = formData.get('lessonId') as string;
    const courseId = formData.get('courseId') as string;

    if (!lessonId || !courseId) {
        return new Response('Missing lessonId or courseId', { status: 400 });
    }

    const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    revalidatePath(`/admin/courses/${courseId}`);
    redirect(`/admin/courses/${courseId}`);
}
