const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAIResponse = async (prompt) => {
  try {
    // 2026 STABLE PREVIEW MODEL
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    // This log is important! It tells us if the error is 404 (model) or 401 (API key)
    console.error("❌ Gemini API Error Details:", error.message);
    return "AI was unable to generate a description. Check server logs.";
  }
};

module.exports = getAIResponse;