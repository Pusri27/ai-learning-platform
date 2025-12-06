const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
let apiKey = null;
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
    if (apiKeyMatch) apiKey = apiKeyMatch[1].trim();
} catch (e) { }

if (!apiKey) {
    console.error("No API Key found");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // There isn't a direct "listModels" on the main class in some versions, 
        // but let's try the model directly first.
        // Actually, the SDK doesn't expose listModels easily in the node client directly in all versions.
        // Let's try a simple generation with the most basic model name 'gemini-pro' again but logging the full error object.

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Test");
        console.log("Success with gemini-pro");
    } catch (error) {
        console.error("Error details:", JSON.stringify(error, null, 2));
        console.error("Message:", error.message);
    }
}

listModels();
