'use client';

import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked_at?: string | null;
}

export default function AchievementsList({ achievements }: { achievements: Achievement[] }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                Your Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => {
                    const isUnlocked = !!achievement.unlocked_at;
                    return (
                        <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center gap-3 p-3 rounded-xl border ${isUnlocked
                                ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-100 dark:border-purple-700'
                                : 'bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600 opacity-60'
                                }`}
                        >
                            <div className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
                                {achievement.icon}
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold ${isUnlocked ? 'text-purple-900 dark:text-purple-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {achievement.title}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{achievement.description}</p>
                            </div>
                            {!isUnlocked && <Lock className="h-3 w-3 text-gray-400 dark:text-gray-500 ml-auto" />}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
