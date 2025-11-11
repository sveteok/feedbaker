import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { SearchUserUiQueryProps } from "@/validations/users";
import { getUsersServer } from "@/lib/fetchers/users/users.server";

export async function prefetchUsersQuery(
  client: QueryClient,
  query: SearchUserUiQueryProps
) {
  await client.prefetchQuery({
    queryKey: queryKeys.users.lists.filtered(query),
    queryFn: () => getUsersServer(query),
  });
}
