import { createClient } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase-admin';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { userId: string } }
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
        const { name, role } = body;

        // Validate role
        if (role && !['user', 'admin'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role. Must be "user" or "admin"' }, { status: 400 });
        }

        // Update user
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (role !== undefined) updateData.role = role;

        const { data: updatedUser, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', params.userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating user:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error('Error in PATCH /api/admin/users/[userId]:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { userId: string } }
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

        // Prevent admin from deleting themselves
        if (params.userId === user.id) {
            return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
        }

        // Use admin client to delete user from Supabase Auth (bypasses RLS)
        const adminSupabase = createAdminClient();
        const { error: authDeleteError } = await adminSupabase.auth.admin.deleteUser(params.userId);

        if (authDeleteError) {
            console.error('Error deleting user from Auth:', authDeleteError);
            return NextResponse.json({ error: authDeleteError.message }, { status: 500 });
        }

        // The profiles row should be deleted automatically via ON DELETE CASCADE,
        // but we delete explicitly as a safety net.
        await supabase.from('profiles').delete().eq('id', params.userId);

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error in DELETE /api/admin/users/[userId]:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
