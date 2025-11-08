import axios, { AxiosResponse } from "axios";

import {
  siteSchema,
  SiteAddFormData,
  SearchQueryProps,
  SearchUiQueryProps,
  paginatedSitesSchema,
} from "@/validations/sites";
import { absoluteURL } from "@/config/env";
import { PaginatedSites, Site } from "@/types/sites";
import { SITE_PAGE_SIZE } from "@/config/constants";
import { getAxiosErrorMessage } from "@/lib/utils/errors";

const baseURL = `${absoluteURL}/api/sites`;

export const getSites = async (
  searchUiQuery: SearchUiQueryProps
): Promise<PaginatedSites> => {
  try {
    const { page = 1, search = "" } = searchUiQuery;

    const searchRestQuery: SearchQueryProps = {
      limit: SITE_PAGE_SIZE,
      offset: Math.max((page - 1) * SITE_PAGE_SIZE, 0),
      searchText: search,
    };

    const response = await axios.get(baseURL, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      params: searchRestQuery,
      withCredentials: true,
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

export const getSite = async (id: string): Promise<Site | null> => {
  try {
    const response = await axios.get(`${baseURL}/${id}`, {
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
    console.error("getSite error:", error);
    throw new Error(getAxiosErrorMessage(error));
  }
};

export const editSite = async (site: Site): Promise<Site | null> => {
  try {
    const response: AxiosResponse = await axios.put(
      `${baseURL}/${site.site_id}`,
      site,
      { withCredentials: true }
    );

    const result = siteSchema.safeParse(response.data);

    if (!result.success) {
      throw new Error("Edit Site: Invalid response data");
    }

    return result.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(getAxiosErrorMessage(error));
  }
};

export const deleteSite = async (id: string): Promise<Site | null> => {
  try {
    const response: AxiosResponse = await axios.delete(`${baseURL}/${id}`, {
      withCredentials: true,
    });

    const result = siteSchema.safeParse(response.data);

    if (!result.success) {
      throw new Error("Delete Site: Invalid response data");
    }
    return result.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(getAxiosErrorMessage(error));
  }
};

export const addSite = async (
  content: SiteAddFormData
): Promise<Site | null> => {
  try {
    const response = await axios.post<Site>(baseURL, content);

    const result = siteSchema.safeParse(response.data);

    if (!result.success) {
      throw new Error("Add Site: Invalid response data");
    }

    return result.data;
  } catch (err) {
    throw new Error(getAxiosErrorMessage(err));
  }
};
