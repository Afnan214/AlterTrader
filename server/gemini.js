const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// create the client with your API key directly (no object wrapper)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function gemini() {
    try {
        // get a specific model instance first
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // now call generateContent() on that model
        const result = await model.generateContent("Explain how AI works in a few words");
        console.log(result.response.text());
        return result.response.text();
        // display the model’s text output
    } catch (error) {
        console.error("Gemini API error:", error);
    }
}

module.exports = { gemini };
