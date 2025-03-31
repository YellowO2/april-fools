import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateArticleContent(
  description: string
): Promise<{ title: string; category: string; content: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `Write a short news article (200-300 words) based on this description: "${description}". 

The article should be written in a style similar to real news articles. The title should be **catchy and believable**. Ensure the article **sounds natural**, not like an AI-generated summary. 

**Formatting Rules:**
- The title must start with: "Title: " followed by the headline.
- The content should start on a new line after the title.
- The category must start with: "Category: " followed by one of these categories: Food, Technology, Education, Lifestyle, Business, Entertainment, Travel.
- Do not use Markdown formatting (e.g., no bold, italics, or bullet points).
- The output should be in plain text.

**Example Format:**
Title: Yorushika Set to Perform in Singapore Next Month!  
Category: Entertainment  
Get ready, Singapore! Acclaimed Japanese musical duo Yorushika is bringing their signature blend of evocative storytelling and breathtaking melodies to our shores next month! After months of anticipation, fans can finally...
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Extract title, category, and content from the response
    const [titleLine, categoryLine, ...contentLines] = response
      .text()
      .split("\n");
    const title = titleLine.replace(/^Title:\s*/, "").trim();
    const category = categoryLine.replace(/^Category:\s*/, "").trim();
    const content = contentLines.join("\n").trim();

    return { title, category, content };
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate article content");
  }
}
