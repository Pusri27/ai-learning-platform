'use client';

import { useState } from 'react';

interface QuestionProps {
    question: string;
    options: string[];
    onAnswer: (index: number) => void;
    selectedOption: number | null;
    showResult: boolean;
    correctIndex: number;
}

export default function QuizQuestion({
    question,
    options,
    onAnswer,
    selectedOption,
    showResult,
    correctIndex,
}: QuestionProps) {
    return (
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">{question}</h3>
            <div className="space-y-3">
                {options.map((option, index) => {
                    let optionClass = "relative block w-full rounded-lg border px-6 py-4 cursor-pointer focus:outline-none sm:flex sm:justify-between transition-colors";

                    if (showResult) {
                        if (index === correctIndex) {
                            optionClass += " bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 ring-1 ring-green-200 dark:ring-green-700";
                        } else if (selectedOption === index) {
                            optionClass += " bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 ring-1 ring-red-200 dark:ring-red-700";
                        } else {
                            optionClass += " border-gray-200 dark:border-gray-700 opacity-50";
                        }
                    } else {
                        if (selectedOption === index) {
                            optionClass += " border-indigo-600 dark:border-indigo-500 ring-1 ring-indigo-600 dark:ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/30";
                        } else {
                            optionClass += " border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700";
                        }
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => !showResult && onAnswer(index)}
                            disabled={showResult}
                            className={optionClass}
                        >
                            <span className="flex items-center">
                                <span className="flex flex-col text-sm">
                                    <span className={`font-medium ${showResult && index === correctIndex ? 'text-green-900 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}>
                                        {option}
                                    </span>
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
