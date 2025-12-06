'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function TutorPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am your AI Tutor. I can help you with AI, Python, and Math. What would you like to learn today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/tutor');
                const data = await res.json();
                if (data.messages && Array.isArray(data.messages)) {
                    // Map DB format to UI format if needed, but they are similar enough
                    // DB: { role: 'user' | 'assistant', content: string, ... }
                    // UI: { role: 'user' | 'assistant', content: string }
                    if (data.messages.length > 0) {
                        setMessages(data.messages.map((m: any) => ({ role: m.role, content: m.content })));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch chat history:', error);
            }
        };

        fetchHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const res = await fetch('/api/tutor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await res.json();

            if (data.reply) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.error || 'Sorry, I encountered an error. Please try again.' }]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="mx-auto max-w-3xl space-y-6">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`flex max-w-[80%] sm:max-w-[70%] rounded-lg px-4 py-3 shadow-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <div className="mr-3 flex-shrink-0 mt-1">
                                    {msg.role === 'user' ? (
                                        <User className="h-5 w-5 text-indigo-200" />
                                    ) : (
                                        <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    )}
                                </div>
                                <div className="text-sm leading-relaxed">
                                    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                                code: ({ node, ...props }) => {
                                                    const { className, children, ...rest } = props as any;
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return match ? (
                                                        <code className={className} {...rest}>
                                                            {children}
                                                        </code>
                                                    ) : (
                                                        <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...rest}>
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex w-full justify-start">
                            <div className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:px-6 lg:px-8 transition-colors duration-200">
                <div className="mx-auto max-w-3xl">
                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask your AI Tutor..."
                            className="block w-full rounded-md border-0 py-3 pl-4 pr-12 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-colors duration-200"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="absolute right-2 inline-flex items-center rounded-md p-2 text-indigo-600 hover:text-indigo-500 disabled:text-gray-300"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
