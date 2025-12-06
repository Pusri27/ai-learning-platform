import { createClient } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { groupId: string } }
) {
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

        // Update study group
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;

        const { data: updatedGroup, error } = await supabase
            .from('study_groups')
            .update(updateData)
            .eq('id', params.groupId)
            .select()
            .single();

        if (error) {
            console.error('Error updating study group:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ group: updatedGroup }, { status: 200 });
    } catch (error) {
        console.error('Error in PATCH /api/admin/study-groups/[groupId]:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { groupId: string } }
) {
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

        // Delete study group
        const { error } = await supabase
            .from('study_groups')
            .delete()
            .eq('id', params.groupId);

        if (error) {
            console.error('Error deleting study group:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Study group deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error in DELETE /api/admin/study-groups/[groupId]:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
