import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildTutorPrompt, TutorResponse } from './promptTemplates';
import { withRetry, getAIErrorMessage } from './retry';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getTutorResponse(
    message: string,
    context?: { courseTitle?: string; lessonTitle?: string; lessonContent?: string }
): Promise<TutorResponse> {
    const { system, user } = buildTutorPrompt(message, context);

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
        return {
            reply: 'Maaf, fitur AI belum dikonfigurasi. Silakan hubungi administrator.',
            suggestedTopics: [],
            questionsToAsk: []
        };
    }

    try {
        const response = await withRetry(async () => {
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                generationConfig: { responseMimeType: 'application/json' }
            });

            const prompt = `${system}\n\nUser Message: ${user}`;
            const result = await model.generateContent(prompt);
            const aiResponse = result.response;
            const text = aiResponse.text();

            if (!text) {
                throw new Error('Empty response from AI');
            }

            // Clean up potential markdown code blocks if Gemini wraps the JSON (even with mime type it might)
            const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(cleanText) as TutorResponse;
        }, { maxRetries: 3 });

        return response;
    } catch (error: any) {
        console.error('Error calling AI Tutor:', error);
        const userMessage = getAIErrorMessage(error);
        return {
            reply: userMessage,
            suggestedTopics: ['Coba lagi nanti'],
            questionsToAsk: []
        };
    }
}
