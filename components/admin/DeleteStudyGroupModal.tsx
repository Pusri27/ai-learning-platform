'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface DeleteStudyGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: {
        id: string;
        name: string;
    };
    onSuccess: (updatedGroup?: any, deletedGroupId?: string) => void;
}

export default function DeleteStudyGroupModal({ isOpen, onClose, group, onSuccess }: DeleteStudyGroupModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleDelete = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/admin/study-groups/${group.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete study group');
            }

            onSuccess(undefined, group.id);
            onClose();
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header with Warning Icon */}
                <div className="flex flex-col items-center p-6 pb-0">
                    <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">Delete Study Group</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
                        Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-gray-200">"{group.name}"</span>?
                    </p>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-400 mb-6">
                        This action cannot be undone. All messages and members associated with this group will be permanently removed.
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Deleting...' : 'Delete Group'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
