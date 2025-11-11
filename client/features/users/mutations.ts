"use client";

import { deleteUser, handleCredentialResponse } from "@/lib/fetchers/users";
import { useAuth } from "@/lib/providers/AuthContext";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { UserPayload } from "@/types/users";

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const USER_MUTATION = {
  DELETE: "onDelete",
  CREATE: "onCreate",
} as const;

export type UserMutationAction =
  (typeof USER_MUTATION)[keyof typeof USER_MUTATION];

export function useUserMutation(
  action: "onCreate"
): UseMutationResult<UserPayload | null, Error, string>;

export function useUserMutation(
  action: "onDelete"
): UseMutationResult<UserPayload | null, Error, string>;

export function useUserMutation(action: UserMutationAction) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser } = useAuth();

  const createMutation = useMutation<UserPayload | null, Error, string>({
    mutationFn: handleCredentialResponse,
    onSuccess: (newUser) => {
      if (newUser === null) return;
      queryClient.setQueryData(queryKeys.users.all, newUser);
      queryClient.setQueryDefaults(queryKeys.users.all, {
        staleTime: Infinity,
      });
      setUser(newUser);
      toast.success(`Welcome ${newUser.name}!`);
      router.push(`/profile`);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation<UserPayload | null, Error, string>({
    mutationFn: deleteUser,

    onSuccess: (_, id) => {
      queryClient.setQueryData<UserPayload[]>(
        queryKeys.users.lists.root(),
        (old = []) => old.filter((user) => user.user_id !== id)
      );
      toast.success("User deleted!");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists.root() });
      router.push(`/`);
    },
    onError: (error) => toast.error(error.message),
  });

  switch (action) {
    case "onCreate":
      return createMutation;
    case "onDelete":
      return deleteMutation;
  }
}
