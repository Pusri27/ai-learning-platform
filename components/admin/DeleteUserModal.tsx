'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        id: string;
        name: string | null;
        email: string;
    };
    onSuccess: (updatedUser?: any, deletedUserId?: string) => void;
}

export default function DeleteUserModal({ isOpen, onClose, user, onSuccess }: DeleteUserModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleDelete = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/admin/users/${user.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete user');
            }

            onSuccess(undefined, user.id);
            onClose();
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete User</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <p className="text-gray-700 dark:text-gray-300">
                            Are you sure you want to delete this user?
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name || 'No Name'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                            </p>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                ⚠️ Warning: This action cannot be undone!
                            </p>
                            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                                All user data including progress, quiz results, and group memberships will be permanently deleted.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Deleting...' : 'Delete User'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
