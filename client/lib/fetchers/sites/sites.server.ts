"use server";

import axios, { AxiosResponse } from "axios";
import { cookies } from "next/headers";

import { Site, PaginatedSites } from "@/types/sites";
import {
  paginatedSitesSchema,
  SearchQueryProps,
  SearchUiQueryProps,
  SiteAddFormData,
  siteSchema,
} from "@/validations/sites";
import { getAxiosErrorMessage } from "@/lib/utils/errors";

import { absoluteURL } from "@/config/env";
import { SITE_PAGE_SIZE } from "@/config/constants";

const baseURL = `${absoluteURL}/api/sites`;

export const getSitesServer = async (
  searchUiQuery: SearchUiQueryProps
): Promise<PaginatedSites> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const { page = 1, search = "" } = searchUiQuery;

    const searchRestQuery: SearchQueryProps = {
      limit: SITE_PAGE_SIZE,
      offset: Math.max((page - 1) * SITE_PAGE_SIZE, 0),
      searchText: search,
    };

    const response = await axios.get(baseURL, {
      // headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      headers: { Cookie: cookieHeader },
      withCredentials: true,
      params: searchRestQuery,
    });

    const result = paginatedSitesSchema.safeParse(response.data);

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

const axiosServer = axios.create({
  baseURL: `${absoluteURL}/api/sites`,
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
  },
});

export const getSiteServer = async (id: string): Promise<Site | null> => {
  try {
    const response = await axiosServer.get(`${baseURL}/${id}`, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });

    const result = siteSchema.safeParse(response.data);
    if (!result.success) {
      console.error("getSite: invalid response", result.error);
      throw new Error("Invalid server response");
    }
    return result.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error("getSites error:", error);
    throw new Error(getAxiosErrorMessage(error));
  }
};

export const editSiteServer = async (site: Site): Promise<Site | null> => {
  try {
    const response: AxiosResponse = await axios.put(
      `${baseURL}/${site.site_id}`,
      site
    );

    const result = siteSchema.safeParse(response.data);
    console.log(result);
    if (!result.success) {
      throw new Error("Edit Site: Invalid response data");
    }

    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(getAxiosErrorMessage(error));
  }
};

export const deleteSiteServer = async (id: string): Promise<Site | null> => {
  try {
    const response: AxiosResponse = await axios.delete(`${baseURL}/${id}`);

    const result = siteSchema.safeParse(response.data);

    if (!result.success) {
      throw new Error("Delete Site: Invalid response data");
    }
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(getAxiosErrorMessage(error));
  }
};

export const addSiteServer = async (
  content: SiteAddFormData
): Promise<Site | null> => {
  try {
    const response = await axios.post<Site>(baseURL, content);

    const result = siteSchema.safeParse(response.data);

    if (!result.success) {
      throw new Error("Add Site: Invalid response data");
    }

    return response.data;
  } catch (err) {
    throw new Error(getAxiosErrorMessage(err));
  }
};
