function normalizeFilters(filters: Record<string, unknown>): string {
  return JSON.stringify(filters, Object.keys(filters).sort());
}

export const queryKeys = {
  sites: {
    all: ["sites"] as const,
    lists: {
      root: () => [...queryKeys.sites.all, "list"] as const,
      filtered: (filters: {
        page?: number;
        search?: string;
        site_id?: string;
      }) =>
        [...queryKeys.sites.all, "list", normalizeFilters(filters)] as const,
    },
    detail: (id: string) => [...queryKeys.sites.all, "byId", id] as const,
  },

  feedback: {
    all: ["feedback"] as const,
    lists: {
      root: () => [...queryKeys.feedback.all, "list"] as const,
      filtered: (filters: {
        page?: number;
        search?: string;
        site_id?: string;
      }) =>
        [...queryKeys.feedback.all, "list", normalizeFilters(filters)] as const,
    },
    detail: (id: string) => [...queryKeys.feedback.all, "byId", id] as const,
  },

  users: {
    all: ["user"] as const,
    lists: {
      root: () => [...queryKeys.users.all, "list"] as const,
      filtered: (filters: {
        page?: number;
        search?: string;
        user_id?: string;
      }) =>
        [...queryKeys.users.all, "list", normalizeFilters(filters)] as const,
    },
    detail: (id: string) => [...queryKeys.users.all, "byId", id] as const,
  },
};
