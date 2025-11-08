"use server";

import axios from "axios";
import { cookies } from "next/headers";

import { Feedback, PaginatedFeedback } from "@/types/feedback";
import {
  baseFeedbackSchema,
  FeedbackSearchQueryProps,
  FeedbackSearchUiQueryProps,
  paginatedFeedbackSchema,
} from "@/validations/feedback";
import { absoluteURL } from "@/config/env";
import { FEEDBACK_PAGE_SIZE } from "@/config/constants";
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

export async function getFeedbackServeOld(
  searchUiQuery: FeedbackSearchUiQueryProps
): Promise<PaginatedFeedback> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const { page = 1, search = "", site_id } = searchUiQuery;

    const params: FeedbackSearchQueryProps = {
      limit: FEEDBACK_PAGE_SIZE,
      offset: Math.max((page - 1) * FEEDBACK_PAGE_SIZE, 0),
      searchText: search,
      site_id,
    };

    const res = await axios.get(baseURL, {
      headers: { Cookie: cookieHeader },
      withCredentials: true,
      params,
    });

    const parsed = paginatedFeedbackSchema.safeParse(res.data);
    if (!parsed.success) throw new Error("Invalid server response");

    return parsed.data;
  } catch (error: unknown) {
    console.error("getSites error:", error);
    throw new Error(getAxiosErrorMessage(error));
  }
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
