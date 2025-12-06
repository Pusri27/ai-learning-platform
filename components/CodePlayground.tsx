'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, ChevronDown } from 'lucide-react';

const LANGUAGES = {
    python: {
        name: 'Python',
        version: '3.10.0',
        defaultCode: `# Write your Python code here
print("Hello from AI Learning Platform!")

def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n-1)

print(f"Factorial of 5 is: {factorial(5)}")`
    },
    cpp: {
        name: 'C++',
        version: '10.2.0',
        defaultCode: `#include <iostream>

int main() {
    std::cout << "Hello from C++!" << std::endl;
    
    int n = 5;
    int fact = 1;
    for(int i = 1; i <= n; i++) {
        fact *= i;
    }
    
    std::cout << "Factorial of " << n << " is: " << fact << std::endl;
    return 0;
}`
    },
    javascript: {
        name: 'JavaScript',
        version: '18.15.0',
        defaultCode: `// Write your JavaScript code here
console.log("Hello from JavaScript!");

function factorial(n) {
    if (n === 0) return 1;
    return n * factorial(n - 1);
}

console.log(\`Factorial of 5 is: \${factorial(5)}\`);`
    },
    java: {
        name: 'Java',
        version: '15.0.2',
        defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        
        int n = 5;
        System.out.println("Factorial of " + n + " is: " + factorial(n));
    }
    
    public static int factorial(int n) {
        if (n == 0) return 1;
        return n * factorial(n - 1);
    }
}`
    },
    go: {
        name: 'Go',
        version: '1.16.2',
        defaultCode: `package main

import "fmt"

func factorial(n int) int {
    if n == 0 {
        return 1
    }
    return n * factorial(n-1)
}

func main() {
    fmt.Println("Hello from Go!")
    fmt.Printf("Factorial of 5 is: %d\\n", factorial(5))
}`
    }
};

type LanguageKey = keyof typeof LANGUAGES;

export default function CodePlayground() {
    const [language, setLanguage] = useState<LanguageKey>('python');
    const [code, setCode] = useState<string>(LANGUAGES.python.defaultCode);
    const [output, setOutput] = useState<string>('');
    const [isRunning, setIsRunning] = useState(false);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value as LanguageKey;
        setLanguage(newLang);
        setCode(LANGUAGES[newLang].defaultCode);
        setOutput('');
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput('');

        try {
            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language: language,
                    version: LANGUAGES[language].version,
                    files: [
                        {
                            content: code
                        }
                    ]
                }),
            });

            const data = await response.json();

            if (data.run) {
                setOutput(data.run.output);
            } else {
                setOutput('Error: Failed to execute code.');
            }
        } catch (error: any) {
            setOutput(`Error: ${error.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    const resetCode = () => {
        setCode(LANGUAGES[language].defaultCode);
        setOutput('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-120px)]">
            {/* Editor Section */}
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <select
                                value={language}
                                onChange={handleLanguageChange}
                                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-1 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {Object.entries(LANGUAGES).map(([key, lang]) => (
                                    <option key={key} value={key}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={resetCode}
                            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title="Reset Code"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </button>
                        <button
                            onClick={runCode}
                            disabled={isRunning}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Play className="h-4 w-4" />
                            {isRunning ? 'Running...' : 'Run'}
                        </button>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        language={language === 'cpp' ? 'cpp' : language}
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value || '')}
                        options={{
                            minimap: { enabled: true },
                            fontSize: 14,
                            scrollBeyondLastLine: true,
                            automaticLayout: true,
                            scrollbar: {
                                vertical: 'visible',
                                horizontal: 'visible',
                                useShadows: false,
                                verticalScrollbarSize: 10,
                                horizontalScrollbarSize: 10,
                            },
                            padding: { top: 16, bottom: 16 },
                        }}
                    />
                </div>
            </div>

            {/* Output Section */}
            <div className="flex flex-col bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
                <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
                    <Terminal className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-300">Terminal Output</span>
                </div>
                <div className="flex-1 p-4 font-mono text-sm text-gray-300 overflow-y-auto whitespace-pre-wrap">
                    {output ? (
                        output
                    ) : (
                        <span className="text-gray-600 italic">Run the code to see output...</span>
                    )}
                </div>
            </div>
        </div>
    );
}
