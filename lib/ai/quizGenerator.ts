import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildQuizPrompt, QuizResponse } from './promptTemplates';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateQuiz(lessonContent: string): Promise<QuizResponse> {
    const { system, user } = buildQuizPrompt(lessonContent);

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: { responseMimeType: 'application/json' }
        });

        const prompt = `${system}\n\n${user}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error('Empty response from AI');
        }

        // Clean up potential markdown code blocks
        const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();

        return JSON.parse(cleanText) as QuizResponse;
    } catch (error: any) {
        console.error('Error generating quiz:', error);
        throw new Error(error.message || 'Failed to generate quiz');
    }
}
