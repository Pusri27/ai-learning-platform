'use client';

import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface Message {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
        name: string;
    };
}

export default function GroupChatClient({ groupId, userId }: { groupId: string, userId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, [groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/groups/messages?groupId=${groupId}`);
            const data = await res.json();
            if (data.messages) {
                // Only update if different to avoid jitter? For now just replace.
                // Ideally check length or last ID.
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const res = await fetch('/api/groups/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupId, content: newMessage }),
            });

            if (res.ok) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => {
                    const isMe = message.user_id === userId;
                    const messageDate = new Date(message.created_at);
                    const dateString = messageDate.toDateString();

                    let showDateSeparator = false;
                    if (index === 0) {
                        showDateSeparator = true;
                    } else {
                        const prevMessageDate = new Date(messages[index - 1].created_at);
                        if (prevMessageDate.toDateString() !== dateString) {
                            showDateSeparator = true;
                        }
                    }

                    const formatDate = (date: Date) => {
                        const today = new Date();
                        const yesterday = new Date(today);
                        yesterday.setDate(yesterday.getDate() - 1);

                        if (date.toDateString() === today.toDateString()) {
                            return 'Today';
                        } else if (date.toDateString() === yesterday.toDateString()) {
                            return 'Yesterday';
                        } else {
                            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                        }
                    };

                    return (
                        <div key={message.id}>
                            {showDateSeparator && (
                                <div className="flex justify-center my-6">
                                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full shadow-sm">
                                        {formatDate(messageDate)}
                                    </span>
                                </div>
                            )}
                            <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-lg px-4 py-2 ${isMe ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
                                    }`}>
                                    {!isMe && (
                                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                                            {message.profiles?.name || 'Anonymous'}
                                        </p>
                                    )}
                                    <p className="text-sm">{message.content}</p>
                                    <p className={`text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-gray-400 dark:text-gray-500'}`}>
                                        {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
