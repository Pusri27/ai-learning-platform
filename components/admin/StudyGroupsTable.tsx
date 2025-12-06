'use client';

import { Calendar, Users, Plus, Hash, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import CreateStudyGroupModal from '@/components/admin/CreateStudyGroupModal';
import EditStudyGroupModal from '@/components/admin/EditStudyGroupModal';
import DeleteStudyGroupModal from '@/components/admin/DeleteStudyGroupModal';

export interface StudyGroup {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    created_by: string | null;
    profiles?: {
        name: string | null;
        email: string | null;
    };
    members_count?: number; // Optional if we fetch it
}

interface StudyGroupsTableProps {
    initialGroups: StudyGroup[];
    initialTotal: number;
    currentUserProfile: { name: string | null; email: string | null } | null;
}

export default function StudyGroupsTable({ initialGroups, initialTotal, currentUserProfile }: StudyGroupsTableProps) {
    const [groups, setGroups] = useState<StudyGroup[]>(initialGroups);
    const [loading, setLoading] = useState(false);

    // Modals state
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<StudyGroup | null>(null);
    const [deletingGroup, setDeletingGroup] = useState<StudyGroup | null>(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalGroups, setTotalGroups] = useState(initialTotal);
    const ITEMS_PER_PAGE = 10;

    const fetchGroups = async (pageNumber: number) => {
        setLoading(true);
        const supabase = createBrowserSupabaseClient();

        // Get total count
        const { count } = await supabase
            .from('study_groups')
            .select('*', { count: 'exact', head: true });

        setTotalGroups(count || 0);

        // Get paginated data with creator info
        const from = (pageNumber - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data, error } = await supabase
            .from('study_groups')
            .select('*, profiles:created_by(name, email)')
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error('Error fetching groups:', error);
        }

        setGroups(data as any || []); // Type casting due to join
        setLoading(false);
    };

    useEffect(() => {
        if (page === 1 && groups === initialGroups) return;
        fetchGroups(page);
    }, [page]);

    const totalPages = Math.ceil(totalGroups / ITEMS_PER_PAGE);

    const handleCreateSuccess = (newGroup: StudyGroup) => {
        // Optimistic update
        const headers = {
            name: currentUserProfile?.name || 'Unknown',
            email: currentUserProfile?.email || null
        };

        const optimisticGroup = {
            ...newGroup,
            profiles: headers
        };

        setGroups(prev => [optimisticGroup, ...prev]);
        setTotalGroups(prev => prev + 1);

        if (page !== 1) {
            setPage(1);
        }
    };

    const handleUpdateSuccess = (updatedGroup?: StudyGroup, deletedId?: string) => {
        if (updatedGroup) {
            // Edit: Optimistic update
            // Preserve the existing profile info if untouche, or update it?
            // API returns new group which might NOT have profile joined.
            // We should merge existing profile info from the old state to avoid losing "Created By" display.

            setGroups(prev => prev.map(g => {
                if (g.id === updatedGroup.id) {
                    return {
                        ...updatedGroup,
                        profiles: g.profiles // Keep existing creator info
                    };
                }
                return g;
            }));
        } else if (deletedId) {
            // Delete: Optimistic update
            setGroups(prev => prev.filter(g => g.id !== deletedId));
            setTotalGroups(prev => prev - 1);

            // If page becomes empty, go to previous page
            if (groups.length === 1 && page > 1) {
                setPage(prev => prev - 1);
            } else if (groups.length === 1 && page === 1) {
                // List is now empty
                fetchGroups(1); // Refresh to be safe (or just leave empty)
            }
        }

        // Close modals handled by setter in render or here?
        // Modals call onSuccess then onClose. 
        // We need to ensure state is clean.
    };

    return (
        <div>
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Group
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Group Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created By</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading && groups.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        Loading...
                                    </td>
                                </tr>
                            ) : groups.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        No study groups found. Create one to get started!
                                    </td>
                                </tr>
                            ) : groups.map((group) => (
                                <tr key={group.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                                    <Hash className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{group.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    ID: {group.id.slice(0, 8)}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" title={group.description || ''}>
                                            {group.description || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <Users className="h-4 w-4 mr-2" />
                                            {group.profiles?.name || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {new Date(group.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setEditingGroup(group)}
                                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-1 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                                                title="Edit Group"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeletingGroup(group)}
                                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                title="Delete Group"
                                            >
                                                <Trash2 className="h-4 w-4" />
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
                    Showing <span className="font-medium">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(page * ITEMS_PER_PAGE, totalGroups)}</span> of <span className="font-medium">{totalGroups}</span> groups
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

            <CreateStudyGroupModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {editingGroup && (
                <EditStudyGroupModal
                    isOpen={!!editingGroup}
                    onClose={() => setEditingGroup(null)}
                    group={editingGroup}
                    onSuccess={(updatedGroup) => handleUpdateSuccess(updatedGroup)}
                />
            )}

            {deletingGroup && (
                <DeleteStudyGroupModal
                    isOpen={!!deletingGroup}
                    onClose={() => setDeletingGroup(null)}
                    group={deletingGroup}
                    onSuccess={(updatedGroup, deletedId) => handleUpdateSuccess(updatedGroup, deletedId)}
                />
            )}
        </div>
    );
}
