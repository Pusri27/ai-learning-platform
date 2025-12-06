const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.resolve(__dirname, '.env.local');
let apiKey = null;

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
    if (apiKeyMatch) {
        apiKey = apiKeyMatch[1].trim();
    }
} catch (e) {
    console.error("Could not read .env.local");
}

if (!apiKey) {
    console.error("GEMINI_API_KEY not found in .env.local");
    process.exit(1);
}

console.log("Testing Gemini API with key: " + apiKey.substring(0, 5) + "...");

const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];

    for (const modelName of modelsToTry) {
        console.log(`\nTesting model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say hello");
            const response = await result.response;
            console.log(`SUCCESS! Model ${modelName} works.`);
            console.log("Response:", response.text());
            return; // Exit on first success
        } catch (error) {
            console.error(`FAILED ${modelName}:`, error.message);
        }
    }

    console.log("\nAll models failed. Please check if your API Key is from AI Studio (aistudio.google.com) and not Vertex AI.");
}

test();
