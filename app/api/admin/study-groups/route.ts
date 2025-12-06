import { createClient } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        // Get request body
        const body = await request.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Create study group
        const { data: group, error } = await supabase
            .from('study_groups')
            .insert({
                name,
                description,
                created_by: user.id
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating study group:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ group }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/admin/study-groups:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
