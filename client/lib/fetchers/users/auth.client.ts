import { absoluteURL } from "@/config/env";
import { PaginatedUsers, UserPayload } from "@/types/users";
import {
  authenticatedUserSchema,
  paginatedUsersSchema,
  SearchuserQueryProps,
  SearchUserUiQueryProps,
  userSchema,
} from "@/validations/users";
import axios, { AxiosResponse } from "axios";
import { getAxiosErrorMessage } from "@/lib/utils/errors";
import { SearchUiQueryProps } from "@/validations/feedback";
import { SITE_PAGE_SIZE } from "@/config/constants";
import { SearchQueryProps } from "@/validations/sites";

const baseURL = `${absoluteURL}/api/users`;

export const fetchProfile = async (): Promise<UserPayload | null> => {
  try {
    const response = await axios.get(`${absoluteURL}/api/profile`, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      withCredentials: true,
    });
    const result = userSchema.safeParse(response.data);
    if (!result.success) {
      throw new Error("Invalid server response");
    }

    return result.data;
  } catch {
    return null;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    const response = await axios.post(`${absoluteURL}/api/logout`, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      withCredentials: true,
    });
    if (!response) {
      throw new Error("Invalid server response");
    }
    return true;
  } catch (error: unknown) {
    console.error("Failed to logout:", error);
    return false;
  }
};

export const handleCredentialResponse = async (
  credential: string
): Promise<UserPayload | null> => {
  try {
    const response = await axios.post(
      `${absoluteURL}/api/auth/google`,
      { credential },
      {
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
        withCredentials: true,
      }
    );
    const result = authenticatedUserSchema.safeParse(response.data);

    if (!result.success) {
      throw new Error("Invalid server response");
    }

    return result.data.userPayload;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return null;
  }
};

export const deleteUser = async (id: string): Promise<UserPayload | null> => {
  try {
    const response: AxiosResponse = await axios.delete(`${baseURL}/${id}`, {
      withCredentials: true,
    });

    const result = userSchema.safeParse(response.data);

    if (!result.success) {
      throw new Error("Delete User: Invalid response data");
    }
    return result.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(getAxiosErrorMessage(error));
  }
};

export const getSiteUsers = async (
  searchUiQuery: SearchUserUiQueryProps & { cookieHeader?: string }
): Promise<PaginatedUsers> => {
  try {
    const { page = 1, search = "", cookieHeader } = searchUiQuery;

    const searchRestQuery: SearchuserQueryProps = {
      limit: SITE_PAGE_SIZE,
      offset: Math.max((page - 1) * SITE_PAGE_SIZE, 0),
      searchText: search,
    };

    const response = await axios.get(baseURL, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      withCredentials: true,
      params: searchRestQuery,
    });

    const result = paginatedUsersSchema.safeParse(response.data);

    if (!result.success) {
      console.error("getSites: invalid response", result.error);
      throw new Error("Invalid server response");
    }

    return result.data;
  } catch (error: unknown) {
    console.error("getSites error:", error);
    throw new Error(getAxiosErrorMessage(error));
  }
};
