import { createClient } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');

    if (!groupId) {
        return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Check membership first? RLS handles it, but good to be explicit or just rely on RLS.
    // RLS policy: "Group messages are viewable by group members."

    const { data: messages, error } = await supabase
        .from('group_messages')
        .select(`
            id,
            content,
            created_at,
            user_id,
            profiles (name)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages });
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { groupId, content } = await request.json();

        if (!groupId || !content) {
            return NextResponse.json({ error: 'Group ID and content are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('group_messages')
            .insert({
                user_id: session.user.id,
                group_id: groupId,
                content
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, message: data });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
