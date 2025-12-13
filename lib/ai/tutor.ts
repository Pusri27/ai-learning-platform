import Groq from 'groq-sdk';
import { buildTutorPrompt, TutorResponse } from './promptTemplates';
import { withRetry, getAIErrorMessage } from './retry';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

export async function getTutorResponse(
    message: string,
    context?: { courseTitle?: string; lessonTitle?: string; lessonContent?: string }
): Promise<TutorResponse> {
    const { system, user } = buildTutorPrompt(message, context);

    // Check if API key is configured
    if (!process.env.GROQ_API_KEY) {
        return {
            reply: 'Maaf, fitur AI belum dikonfigurasi. Silakan hubungi administrator.',
            suggestedTopics: [],
            questionsToAsk: []
        };
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

