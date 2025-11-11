"use server";

import axios from "axios";
import { cookies } from "next/headers";

import { Feedback } from "@/types/feedback";
import {
  baseFeedbackSchema,
  FeedbackSearchUiQueryProps,
} from "@/validations/feedback";
import { absoluteURL } from "@/config/env";
import { getAxiosErrorMessage } from "@/lib/utils/errors";
import { getFeedback } from "./feedback.client";

const baseURL = `${absoluteURL}/api/feedback`;

export async function getFeedbackServer(query: FeedbackSearchUiQueryProps) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return getFeedback({
    ...query,
    cookieHeader,
  });
}

export const getFeedbackDetailServer = async (
  id: string
): Promise<Feedback | null> => {
  try {
    const response = await axios.get<Feedback>(`${baseURL}/${id}`, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });

    const result = baseFeedbackSchema.safeParse(response.data);

    if (!result.success) {
      throw new Error("Get Feedback: Invalid response data");
    }
    return result.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error("getFeedback error:", error);
    throw new Error(getAxiosErrorMessage(error));
  }
};
