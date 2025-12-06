import { getTutorResponse } from '@/lib/ai/tutor';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages: data });
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { message, context } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // 1. Save User Message
        await supabase.from('chat_messages').insert({
            user_id: user.id,
            role: 'user',
            content: message
        });

        // 2. Get AI Response
        const response = await getTutorResponse(message, context);

        // 3. Save AI Response
        // Note: response.reply contains the text
        if (response.reply) {
            await supabase.from('chat_messages').insert({
                user_id: user.id,
                role: 'assistant',
                content: response.reply
            });
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in tutor route:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}
