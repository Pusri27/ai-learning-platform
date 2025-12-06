'use client';

import { useState, useEffect } from 'react';
import { Send, User } from 'lucide-react';

interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
        name: string;
    };
}

export default function LessonComments({ lessonId }: { lessonId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [lessonId]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/comments?lessonId=${lessonId}`);
            const data = await res.json();
            if (data.comments) {
                setComments(data.comments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId, content: newComment }),
            });

            if (res.ok) {
                setNewComment('');
                fetchComments(); // Refresh list
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Discussion</h3>

            {/* Comment List */}
            <div className="space-y-6 mb-8">
                {loading ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">No comments yet. Be the first to start the discussion!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <User className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                            {comment.profiles?.name || 'Anonymous'}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="relative">
                <textarea
                    rows={3}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4 pr-12 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border"
                    placeholder="Ask a question or share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={submitting}
                />
                <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="absolute bottom-3 right-3 inline-flex items-center rounded-full bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="h-4 w-4" />
                </button>
            </form>
        </div>
    );
}
