import { QueryClient } from "@tanstack/react-query";

let browserClient: QueryClient | null = null;

export default function getQueryClient() {
  if (typeof window === "undefined") {
    return new QueryClient();
  }

  if (!browserClient) {
    browserClient = new QueryClient();
  }

  return browserClient;
}
