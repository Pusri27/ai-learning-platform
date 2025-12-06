'use client';

import { Mail, Calendar, Shield, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import EditUserModal from '@/components/admin/EditUserModal';
import DeleteUserModal from '@/components/admin/DeleteUserModal';

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
    created_at: string;
    xp: number | null;
}

interface UsersTableProps {
    initialUsers: User[];
    initialTotal: number;
    currentUserId: string | null;
}

export default function UsersTable({ initialUsers, initialTotal, currentUserId }: UsersTableProps) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [loading, setLoading] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(initialTotal);
    const ITEMS_PER_PAGE = 10;

    const fetchUsers = async (pageNumber: number) => {
        setLoading(true);
        const supabase = createBrowserSupabaseClient();

        // Get total count (refresh count as well)
        const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        setTotalUsers(count || 0);

        // Get paginated data
        const from = (pageNumber - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error('Error fetching users:', error);
        }

        setUsers(data || []);
        setLoading(false);
    };

    // Fetch when page changes, but skip first render if we rely on initial data
    // However, if we delete/edit, we might want to refresh.
    // Let's use a flag or just simplistic check.
    useEffect(() => {
        // Skip fetching on mount because we have initial data for page 1
        if (page === 1 && users === initialUsers) return;

        fetchUsers(page);
    }, [page]);

    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const handleSuccess = (updatedUser?: User, deletedUserId?: string) => {
        if (updatedUser) {
            // Optimistic update for edit
            setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            setEditModalOpen(false);
            setSelectedUser(null);
        } else if (deletedUserId) {
            // Optimistic update for delete
            const newUsers = users.filter(u => u.id !== deletedUserId);

            // If page becomes empty, go to previous page content is fetched by effect
            if (newUsers.length === 0 && page > 1) {
                setPage(p => p - 1);
            } else if (newUsers.length === 0 && page === 1) {
                // Page 1 empty
                setUsers([]);
            } else {
                setUsers(newUsers);
            }

            setTotalUsers(prev => Math.max(0, prev - 1));
            setDeleteModalOpen(false);
            setSelectedUser(null);
        } else {
            // Fallback
            fetchUsers(page);
        }
    };

    return (
        <div>
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">XP</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        Loading...
                                    </td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                                    {user.email?.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name || 'No Name'}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                    <Mail className="h-3 w-3 mr-1" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                            <Shield className="h-3 w-3 mr-1" />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {user.xp || 0} XP
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="inline-flex items-center px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                                            >
                                                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                disabled={user.id === currentUserId}
                                                className="inline-flex items-center px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title={user.id === currentUserId ? "Cannot delete your own account" : "Delete user"}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-medium">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(page * ITEMS_PER_PAGE, totalUsers)}</span> of <span className="font-medium">{totalUsers}</span> users
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modals */}
            {selectedUser && (
                <>
                    <EditUserModal
                        isOpen={editModalOpen}
                        onClose={() => setEditModalOpen(false)}
                        user={selectedUser}
                        onSuccess={handleSuccess}
                    />
                    <DeleteUserModal
                        isOpen={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        user={selectedUser}
                        onSuccess={handleSuccess}
                    />
                </>
            )}
        </div>
    );
}
