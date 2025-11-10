"use client";

import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { UserPayload } from "@/types/users";
import { handleCredentialResponse } from "@/lib/fetchers/users/auth.client";
import { useAuth } from "@/lib/providers/AuthContext";
import { queryKeys } from "@/lib/react-query/queryKeys";
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";

export default function LoginPage() {
  const { setUser } = useAuth();

  const queryClient = useQueryClient();
  const router = useRouter();

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

  const onGoogleSignIn = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        toast.error("Google Sign-In failed: No credential received");
        return;
      }
      console.log(credentialResponse);
      createMutation.mutate(credentialResponse?.credential);
    } catch (error) {
      console.error("Google Sign-In error:", error);
      toast.error("Google Sign-In failed");
    }
  };

  return (
    <div className="bg-white grid justify-center items-center">
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <div className="p-4 bg-sky-50 ring-4 ring-sky-100 rounded-md min-w-md min-h-20 flex items-center justify-center">
          <GoogleLogin onSuccess={onGoogleSignIn} />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
}
