import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function generateSummary(content) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a high-quality summary of approximately 200 words for the following blog post content. Focus on the key takeaways and main points:\n\n${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Summary generation failed:", error);
    return ""; // Fallback to empty string if AI fails
  }
}
