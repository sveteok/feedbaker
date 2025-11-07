export const queryKeys = {
  sites: {
    all: ["sites"] as const,
    lists: {
      root: () => [...queryKeys.sites.all, "list"] as const,
      filtered: (filters: {
        page?: number;
        search?: string;
        site_id?: string;
      }) => [...queryKeys.sites.all, "list", JSON.stringify(filters)] as const,
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
        [...queryKeys.feedback.all, "list", JSON.stringify(filters)] as const,
    },
    detail: (id: string) => [...queryKeys.feedback.all, "byId", id] as const,
  },

  users: {
    all: ["users"] as const,
    list: () => [...queryKeys.users.all, "list"] as const,
    detail: (id: string) => [...queryKeys.users.all, "byId", id] as const,
  },
};
