"use server";

import axios from "axios";
import { cookies } from "next/headers";

import { PaginatedUsers } from "@/types/users";
import {
  SearchuserQueryProps,
  SearchUserUiQueryProps,
} from "@/validations/users";
import { SearchQueryProps } from "@/validations/sites";

import { absoluteURL } from "@/config/env";
import { SITE_PAGE_SIZE } from "@/config/constants";
import { getAxiosErrorMessage } from "@/lib/utils/errors";
import { paginatedUsersSchema } from "@/validations/users";
import { getSiteUsers } from "./auth.client";

const baseURL = `${absoluteURL}/api/users`;

export async function getUsersServer(query: SearchUserUiQueryProps) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return getSiteUsers({
    ...query,
    cookieHeader,
  });
}

export const getUsersServerOld = async (
  searchUiQuery: SearchUserUiQueryProps
): Promise<PaginatedUsers> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const { page = 1, search = "" } = searchUiQuery;

    const searchRestQuery: SearchuserQueryProps = {
      limit: SITE_PAGE_SIZE,
      offset: Math.max((page - 1) * SITE_PAGE_SIZE, 0),
      searchText: search,
    };

    const response = await axios.get(baseURL, {
      //   headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      headers: { Cookie: cookieHeader },
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
