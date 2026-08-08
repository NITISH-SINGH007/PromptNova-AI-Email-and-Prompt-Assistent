const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Missing VITE_GEMINI_API_KEY environment variable.");
}

export interface EmailAnalysisResult {
  summary: string;
  priority: "Low" | "Medium" | "High";
  tasks: Array<{ task: string; deadline?: string }>;
  isSpam: boolean;
  smartReplies: string[];
}

export async function analyzeEmail(emailContent: string): Promise<EmailAnalysisResult> {
  const prompt = `You are an AI Email Assistant. Your job is to analyze the following email and return a structured JSON response.

Here is the email:
"""
${emailContent}
"""

Analyze the email and extract the following:
1. "summary": A concise summary of the email.
2. "priority": Determine if the email is "Low", "Medium", or "High" priority. Use "High" for urgent issues, direct requests, or short deadlines.
3. "tasks": An array of actionable tasks extracted from the email. Each task should have a "task" description and an optional "deadline" (if mentioned).
4. "isSpam": A boolean indicating if the email looks like spam, phishing, or an unwanted promotional email.
5. "smartReplies": An array of 3 distinct, context-aware reply suggestions (as strings).

Return ONLY a valid JSON object matching this structure. Do not wrap it in markdown code blocks, just return the raw JSON object.

Example JSON format:
{
  "summary": "...",
  "priority": "High",
  "tasks": [{ "task": "...", "deadline": "..." }],
  "isSpam": false,
  "smartReplies": ["...", "...", "..."]
}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey || "dummy"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error?.message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const resultJson = JSON.parse(resultText) as EmailAnalysisResult;
    
    return resultJson;
  } catch (error: any) {
    console.error("Failed to analyze email:", error);
    throw new Error(error?.message || "Failed to analyze email with Gemini AI.");
  }
}
