'use client';

import { Trash2 } from 'lucide-react';

export default function DeleteLessonButton({ lessonId, courseId }: { lessonId: string, courseId: string }) {
    return (
        <form action="/api/admin/lessons/delete" method="POST" className="inline-block">
            <input type="hidden" name="lessonId" value={lessonId} />
            <input type="hidden" name="courseId" value={courseId} />
            <button
                type="submit"
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30"
                onClick={(e) => {
                    if (!confirm('Are you sure you want to delete this lesson?')) {
                        e.preventDefault();
                    }
                }}
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </form>
    );
}
