import axios from "axios";

import { absoluteURL } from "@/config/env";

const CSRF_COOKIE_NAME = "XSRF-TOKEN";

const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, ...rest] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return null;
};

const ensureCsrfToken = async (): Promise<string> => {
  const existingToken = getCookieValue(CSRF_COOKIE_NAME);
  if (existingToken) {
    return existingToken;
  }

  await axios.get(`${absoluteURL}/api/profile/csrf`, {
    headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    withCredentials: true,
  });

  const token = getCookieValue(CSRF_COOKIE_NAME);
  if (!token) {
    throw new Error("Failed to initialize CSRF protection");
  }

  return token;
};

export const getCsrfHeaders = async (): Promise<Record<string, string>> => ({
  "x-csrf-token": await ensureCsrfToken(),
});
