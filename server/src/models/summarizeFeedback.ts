import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface AiErrorWithCode {
  message?: string;
  error?: {
    code?: number;
  };
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error: unknown) {
      const isOverloadedError = (err: unknown): err is AiErrorWithCode => {
        if (typeof err !== "object" || err === null) {
          return false;
        }

        const typedErr = err as AiErrorWithCode;

        const is503ByMessage =
          typeof typedErr.message === "string" &&
          typedErr.message.includes("503");
        const is503ByCode = typedErr.error?.code === 503;

        return is503ByMessage || is503ByCode;
      };

      if (isOverloadedError(error) && attempt < maxRetries - 1) {
        attempt++;
        const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s...
        console.warn(
          `[API Retry] Model overloaded. Retrying in ${waitTime / 1000}s... (Attempt ${attempt}/${maxRetries})`
        );
        await delay(waitTime);
      } else {
        // Throw all other errors (or the final 503 error)
        throw error;
      }
    }
  }
  // This line is technically unreachable if maxRetries > 0, but good for safety
  throw new Error("Failed after maximum retries.");
}

export const summarizeFeedback = async (
  feedback: {
    body: string;
    feedback_id: string;
    site_id: string;
  }[]
): Promise<string | undefined> => {
  const allFeedbackText = feedback.map((row) => row.body).join("\n---\n");

  const prompt = `You are a professional feedback analyst. Summarize the following user feedback entries into a concise report.
        You are a professional feedback analyst.
        Summarize the following user feedback entries into a concise report.
        Provide one or two paragraphs of text so it can be easy shown on web page for visitors.
    
        FEEDBACK ENTRIES:
        ---
        ${allFeedbackText}
        ---
        `;

  console.log("prompt ", prompt);

  const aiCall = async () => {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return aiResponse.text;
  };

  try {
    const summary = await retryWithBackoff(aiCall, 4); // Retry up to 4 times
    console.log("summary result:  ", summary);
    return summary;
  } catch (error) {
    console.log(error);
  }

  console.log("summary result:  ERROR");
  return "error";
};
