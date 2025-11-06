export const feedbackKeys = {
  all: ["feedbacks"] as const,
  lists: () => [...feedbackKeys.all, "lists"] as const,
  list: (filters: { page?: number; search?: string; site_id?: string }) =>
    [...feedbackKeys.lists(), filters] as const,
  detail: (id: string) => [...feedbackKeys.all, "detail", id] as const,
};

export const sitesKeys = {
  all: ["sites"] as const,
  lists: () => [...sitesKeys.all, "lists"] as const,
  list: (filters: { page?: number; search?: string }) =>
    [...sitesKeys.lists(), "list", filters] as const,
  detail: (id: string) => [...sitesKeys.all, "detail", id] as const,
};
