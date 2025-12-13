import Groq from 'groq-sdk';
import { buildQuizPrompt, QuizResponse } from './promptTemplates';
import { withRetry, getAIErrorMessage } from './retry';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

export async function generateQuiz(lessonContent: string): Promise<QuizResponse> {
    const { system, user } = buildQuizPrompt(lessonContent);

    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
        throw new Error('Fitur AI belum dikonfigurasi. Silakan hubungi administrator.');
    }

    try {
        const response = await withRetry(async () => {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: system },
                    { role: 'user', content: user }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 2048,
                response_format: { type: 'json_object' }
            });

            const text = chatCompletion.choices[0]?.message?.content;

            if (!text) {
                throw new Error('Empty response from AI');
            }

            // Clean up potential markdown code blocks
            const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleanText) as QuizResponse;
        }, { maxRetries: 3 });

        return response;
    } catch (error: any) {
        console.error('Error generating quiz:', error);
        const userMessage = getAIErrorMessage(error);
        throw new Error(userMessage);
    }
}

