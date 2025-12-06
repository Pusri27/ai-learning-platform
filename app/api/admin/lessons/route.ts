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
    const content = formData.get('content') as string;
    const orderIndex = formData.get('orderIndex') as string;

    if (!courseId || !title || !content) {
        return new Response('Missing required fields', { status: 400 });
    }

    const { error } = await supabase
        .from('lessons')
        .insert({
            course_id: courseId,
            title,
            content,
            order_index: parseInt(orderIndex || '0'),
        });

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    revalidatePath(`/admin/courses/${courseId}`);
    redirect(`/admin/courses/${courseId}`);
}
