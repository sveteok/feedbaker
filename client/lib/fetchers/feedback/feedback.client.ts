import { FEEDBACK_PAGE_SIZE } from "@/config/constants";
import { absoluteURL } from "@/config/env";
import { getAxiosErrorMessage } from "@/lib/utils/errors";
import { Feedback, PaginatedFeedback } from "@/types/feedback";
import {
  baseFeedbackSchema,
  FeedbackAddFormData,
  FeedbackSearchUiQueryProps,
  FeedbackUpdateFormData,
  paginatedFeedbackSchema,
  SummarizeFeedbackData,
  summarizeFeedbackSchema,
} from "@/validations/feedback";
import axios, { AxiosResponse } from "axios";
import { z } from "zod";

const baseURL = `${absoluteURL}/api/feedback`;

export const summarizeFeedback = async (
  site_id: string,
  cookieHeader?: string
): Promise<SummarizeFeedbackData> => {
  try {
    console.log(site_id);
    const response = await axios.get(`${baseURL}/summarize`, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      params: { site_id },
      withCredentials: true,
    });

    const result = summarizeFeedbackSchema.safeParse(response.data);

    if (!result.success) {
      console.error("getSites: invalid response", result.error);
      throw new Error("Invalid server response");
    }

    console.log(result.data);
    return result.data;
  } catch (error: unknown) {
    console.error("getFeedback error:", error);
    throw new Error(getAxiosErrorMessage(error));
  }
};

export const getFeedback = async (
  searchUiQuery: FeedbackSearchUiQueryProps & { cookieHeader?: string }
): Promise<PaginatedFeedback> => {
  try {
    const { page = 1, search = "", site_id, cookieHeader } = searchUiQuery;

    const searchRestQuery = {
      limit: FEEDBACK_PAGE_SIZE,
      offset: Math.max((page - 1) * FEEDBACK_PAGE_SIZE, 0),
      searchText: search,
      site_id,
    };

    const response = await axios.get(`${baseURL}`, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      withCredentials: true,
      params: searchRestQuery,
    });

    const result = paginatedFeedbackSchema.safeParse(response.data);

    if (!result.success) {
      console.error("getSites: invalid response", result.error);
      throw new Error("Invalid server response");
    }

    return result.data;
  } catch (error: unknown) {
    console.error("getFeedback error:", error);
    throw new Error(getAxiosErrorMessage(error));
  }
};

export const getFeedbackDetail = async (
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

export const editFeedback = async (
  feedback: FeedbackUpdateFormData
): Promise<Feedback | null> => {
  try {
    const response: AxiosResponse = await axios.put(
      `${baseURL}/${feedback.feedback_id}`,

      {
        comment: feedback.comment,
        feedback_public: feedback.public,
      },
      { withCredentials: true }
    );

    const result = baseFeedbackSchema.safeParse(response.data);

    if (!result.success) {
      throw new Error("Edit Feedback: Invalid response data");
    }

    return result.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(getAxiosErrorMessage(error));
  }
};

export const deleteFeedback = async (id: string): Promise<Feedback | null> => {
  try {
    const response: AxiosResponse = await axios.delete(`${baseURL}/${id}`, {
      withCredentials: true,
    });

    const result = baseFeedbackSchema.safeParse(response.data);

    if (!result.success) {
      console.error(z.treeifyError(result.error));
      throw new Error("Delete Feedback: Invalid response data");
    }
    return result.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(getAxiosErrorMessage(error));
  }
};

export const addFeedback = async (
  content: FeedbackAddFormData
): Promise<Feedback | null> => {
  try {
    const response = await axios.post<Feedback>(baseURL, content);

    const result = baseFeedbackSchema.safeParse(response.data);

    if (!result.success) {
      throw new Error("Add Feedback: Invalid response data");
    }

    return result.data;
  } catch (err) {
    throw new Error(getAxiosErrorMessage(err));
  }
};
