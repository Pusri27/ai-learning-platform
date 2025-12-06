import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildTutorPrompt, TutorResponse } from './promptTemplates';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getTutorResponse(
    message: string,
    context?: { courseTitle?: string; lessonTitle?: string; lessonContent?: string }
): Promise<TutorResponse> {
    const { system, user } = buildTutorPrompt(message, context);

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: { responseMimeType: 'application/json' }
        });

        // Gemini doesn't have a separate "system" role in the same way as OpenAI for simple chat.
        // We can prepend the system instruction to the user message or use the systemInstruction property if available (beta).
        // For simplicity and compatibility, we'll combine them or use a chat session.

        // Using generateContent with a combined prompt is often easiest for single-turn.
        // However, to ensure JSON output, we should be explicit.

        const prompt = `${system}\n\nUser Message: ${user}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error('Empty response from AI');
        }

        // Clean up potential markdown code blocks if Gemini wraps the JSON (even with mime type it might)
        const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();

        return JSON.parse(cleanText) as TutorResponse;
    } catch (error: any) {
        console.error('Error calling AI Tutor:', error);
        throw new Error(error.message || 'Failed to get response from AI Tutor');
    }
}
