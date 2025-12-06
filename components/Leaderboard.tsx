'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, User } from 'lucide-react';

interface LeaderboardUser {
    id: string;
    name: string;
    xp: number;
    rank?: number;
}

export default function Leaderboard({ users }: { users: LeaderboardUser[] }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top Learners
            </h3>
            <div className="space-y-4">
                {users.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                index === 1 ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300' :
                                    index === 2 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                                        'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 ring-1 ring-gray-200 dark:ring-gray-600'
                                }`}>
                                {index + 1}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-300 text-sm">{user.name || 'Anonymous'}</span>
                            </div>
                        </div>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{user.xp} XP</span>
                    </motion.div>
                ))}
                {users.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">No data yet.</p>
                )}
            </div>
        </div>
    );
}
