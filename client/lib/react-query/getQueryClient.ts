import { QueryClient } from "@tanstack/react-query";

let browserClient: QueryClient | null = null;

export default function getQueryClient() {
  if (typeof window === "undefined") {
    return new QueryClient();
  }

  if (!browserClient) {
    browserClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60, // 1 minute
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  return browserClient;
}
