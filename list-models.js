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

// Use a direct fetch to list models because the SDK's listModels might be tricky in some versions
// or we want to see exactly what the API returns.
async function listModels() {
    console.log("Fetching models with key:", apiKey.substring(0, 5) + "...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
            return;
        }

        if (!data.models) {
            console.log("No models found in response:", data);
            return;
        }

        console.log("\nAvailable Models:");
        const generateModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));

        generateModels.forEach(m => {
            console.log(`- ${m.name.replace('models/', '')} (${m.displayName})`);
        });

        if (generateModels.length === 0) {
            console.log("No models support generateContent.");
        }

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

listModels();
