import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildQuizPrompt, QuizResponse } from './promptTemplates';
import { withRetry, getAIErrorMessage, AIQuotaExceededError } from './retry';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateQuiz(lessonContent: string): Promise<QuizResponse> {
    const { system, user } = buildQuizPrompt(lessonContent);

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('Fitur AI belum dikonfigurasi. Silakan hubungi administrator.');
    }

    try {
        const response = await withRetry(async () => {
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                generationConfig: { responseMimeType: 'application/json' }
            });

            const prompt = `${system}\n\n${user}`;
            const result = await model.generateContent(prompt);
            const aiResponse = result.response;
            const text = aiResponse.text();

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
