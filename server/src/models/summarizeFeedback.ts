import { GoogleGenAI } from "@google/genai";
import { FeedbackSummarizeResult } from "../types/feedback";
import { feedbackSummarizeUpdateSchema } from "../validations/feedback";
import { updateFeedbackSummarize } from "./feedback";

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
  }[],
  site_id: string
): Promise<void> => {
  if (feedback.length === 0) {
    await updateStatus({
      site_id,
      summary: "No public feedback available yet.",
      error: null,
    });
    return;
  }

  const allFeedbackText = feedback.map((row) => row.body).join("\n---\n");

  const prompt = `You are a professional feedback analyst. Summarize the following user feedback entries into a concise report.
        You are a professional feedback analyst.
        Summarize the following user feedback entries into a concise report.
        Provide 2-3 sentenses of text so it can be easy shown on web page for visitors.
        Text must be easy to read and includes relevant light and funny joke.
    
        FEEDBACK ENTRIES:
        ---
        ${allFeedbackText}
        ---
        `;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    await updateStatus({
      site_id,
      summary: null,
      error: "GEMINI_API_KEY is not configured.",
    });
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  const aiCall = async () => {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return aiResponse.text;
  };

  try {
    const summary = await retryWithBackoff(aiCall, 4); // Retry up to 4 times

    await updateStatus({
      site_id,
      summary:
        summary?.trim() || "No summary could be generated from the feedback.",
      error: null,
    });
    return;
  } catch (error) {
    console.error("Failed to summarize feedback", error);
  }

  await updateStatus({
    site_id,
    summary: null,
    error: "Failed to generate summary.",
  });
};

export const updateStatus = async (summary_result: FeedbackSummarizeResult) => {
  try {
    const summaryParsed = feedbackSummarizeUpdateSchema.parse(summary_result);

    await updateFeedbackSummarize(summaryParsed);
  } catch (error) {
    console.error("Failed to persist feedback summary state", error);
  }
};
