'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QuizQuestion from '@/components/QuizQuestion';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import LessonComments from '@/components/LessonComments';

interface Lesson {
    id: string;
    title: string;
    content: string;
    course_id: string;
}

interface QuizData {
    questions: {
        question: string;
        options: string[];
        correctIndex: number;
    }[];
}

interface LessonClientProps {
    lesson: Lesson;
    initialCompleted: boolean;
    courseId: string;
    lessonId: string;
    prevLessonId?: string;
    nextLessonId?: string;
}

export default function LessonClient({ lesson, initialCompleted, courseId, lessonId, prevLessonId, nextLessonId }: LessonClientProps) {
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [quizLoading, setQuizLoading] = useState(false);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [completed, setCompleted] = useState(initialCompleted);

    const router = useRouter();

    const handleGenerateQuiz = async () => {
        setQuizLoading(true);
        try {
            const res = await fetch('/api/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId: lesson.id }),
            });
            const data = await res.json();
            if (data.questions) {
                setQuiz(data);
            }
        } catch (error) {
            console.error('Failed to generate quiz', error);
            alert('Failed to generate quiz. Please try again.');
        } finally {
            setQuizLoading(false);
        }
    };

    const handleAnswer = (questionIndex: number, optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
    };

    const handleSubmitQuiz = async () => {
        if (!quiz) return;

        let correctCount = 0;
        quiz.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctIndex) correctCount++;
        });

        // Calculate percentage score (0-100)
        const rawScore = (correctCount / quiz.questions.length) * 100;
        const finalScore = Math.round(rawScore); // Round for integer storage
        // Store precise score in state for display if needed, or just integer
        setScore(finalScore);
        setShowResults(true);

        // Save progress with percentage score
        try {
            await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId,
                    lessonId,
                    completed: true,
                    score: finalScore,
                    answers: answers
                }),
            });
            setCompleted(true);
            router.refresh(); // Refresh server components to update progress elsewhere
        } catch (error) {
            console.error('Failed to save progress', error);
        }
    };

    const handleMarkCompleted = async () => {
        try {
            await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId,
                    lessonId,
                    completed: true
                }),
            });
            setCompleted(true);
            router.refresh();
        } catch (error) {
            console.error('Failed to save progress', error);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen pb-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
                <Link href={`/dashboard/courses/${courseId}`} className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Course
                </Link>

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
                    {completed && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                            <CheckCircle className="mr-1.5 h-4 w-4" /> Completed
                        </span>
                    )}
                </div>

                <div className="prose prose-indigo dark:prose-invert max-w-none mb-12">
                    {/* In a real app, use a markdown renderer here */}
                    <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                </div>

                <div className="border-t border-gray-200 pt-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz</h2>
                        {!quiz && !completed && (
                            <button
                                onClick={handleMarkCompleted}
                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium"
                            >
                                Mark as completed without quiz
                            </button>
                        )}
                    </div>

                    {!quiz ? (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Test your knowledge</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Generate an AI-powered quiz based on this lesson's content.</p>
                            <button
                                onClick={handleGenerateQuiz}
                                disabled={quizLoading}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                            >
                                {quizLoading ? 'Generating Quiz...' : 'Generate Quiz'}
                            </button>
                        </div>
                    ) : (
                        <div>
                            {quiz.questions.map((q, idx) => (
                                <QuizQuestion
                                    key={idx}
                                    question={q.question}
                                    options={q.options}
                                    correctIndex={q.correctIndex}
                                    selectedOption={answers[idx] ?? null}
                                    onAnswer={(optIdx) => handleAnswer(idx, optIdx)}
                                    showResult={showResults}
                                />
                            ))}

                            {!showResults && (
                                <div className="mt-6">
                                    <button
                                        onClick={handleSubmitQuiz}
                                        disabled={Object.keys(answers).length < quiz.questions.length}
                                        className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                    >
                                        Submit Quiz
                                    </button>
                                </div>
                            )}

                            {showResults && (
                                <div className={`mt-6 p-4 rounded-md ${score! >= 60 ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                                    <p className="font-bold text-lg text-center">
                                        You scored {score}%
                                    </p>
                                    <p className="text-center mt-2">
                                        {score! >= 60 ? 'Great job! You passed.' : 'Keep practicing! Try to get at least 60%.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
                    {prevLessonId ? (
                        <Link
                            href={`/dashboard/courses/${courseId}/lesson/${prevLessonId}`}
                            className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Previous Lesson
                        </Link>
                    ) : (
                        <div></div> // Spacer
                    )}

                    {nextLessonId && (
                        <Link
                            href={`/dashboard/courses/${courseId}/lesson/${nextLessonId}`}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Next Lesson <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                        </Link>
                    )}
                </div>

                <LessonComments lessonId={lesson.id} />
            </div>
        </div>
    );
}
