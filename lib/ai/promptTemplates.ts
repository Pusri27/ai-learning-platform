export interface TutorResponse {
    reply: string;
    suggestedTopics: string[];
    questionsToAsk: string[];
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
}

export interface QuizResponse {
    questions: QuizQuestion[];
}

export function buildTutorPrompt(userMessage: string, context?: { courseTitle?: string; lessonTitle?: string; lessonContent?: string }) {
    let systemPrompt = `You are AILEARN, a friendly and patient AI tutor specialized in teaching AI, Python, and Mathematics.
Your goal is to explain concepts clearly, provide examples, and check for understanding.
You should always be encouraging and helpful.

You must respond in strict JSON format with the following structure:
{
  "reply": "Your response to the user here. Use markdown for formatting code or bold text.",
  "suggestedTopics": ["Topic 1", "Topic 2", "Topic 3"],
  "questionsToAsk": ["Follow-up question 1", "Follow-up question 2"]
}
`;

    if (context) {
        systemPrompt += `\nContext:\n`;
        if (context.courseTitle) systemPrompt += `Course: ${context.courseTitle}\n`;
        if (context.lessonTitle) systemPrompt += `Current Lesson: ${context.lessonTitle}\n`;
        if (context.lessonContent) systemPrompt += `Lesson Content: ${context.lessonContent.substring(0, 1000)}...\n`; // Truncate if too long
    }

    return {
        system: systemPrompt,
        user: userMessage
    };
}

export function buildQuizPrompt(lessonContent: string) {
    return {
        system: `You are an expert exam creator.
Your task is to generate a multiple-choice quiz based on the provided lesson content.
Create exactly 5 questions.
Each question must have 4 options.
Indicate the correct option index (0-3).

You must respond in strict JSON format with the following structure:
{
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0
    },
    ...
  ]
}`,
        user: `Generate a quiz for this content:\n\n${lessonContent}`
    };
}
