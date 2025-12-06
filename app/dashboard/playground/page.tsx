import { createClient } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CodePlayground from '@/components/CodePlayground';

export default async function PlaygroundPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/auth/login');
    }

    return (
        <div className="h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex flex-col">
            <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Interactive Code Playground</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Write and execute Python code directly in your browser.</p>
                </div>
            </header>

            <div className="flex-1 p-6 overflow-hidden">
                <CodePlayground />
            </div>
        </div>
    );
}
