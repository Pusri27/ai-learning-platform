import { createClient } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let targetGroupId: string | null = null;

    try {
        const formData = await request.formData();
        const groupId = formData.get('groupId') as string;

        if (!groupId) {
            return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('group_members')
            .insert({
                user_id: session.user.id,
                group_id: groupId
            });

        if (error) {
            // Ignore unique violation (already joined)
            if (error.code !== '23505') {
                throw error;
            }
        }

        targetGroupId = groupId;
    } catch (error) {
        console.error('Error joining group:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    if (targetGroupId) {
        redirect(`/dashboard/groups/${targetGroupId}`);
    }
}
