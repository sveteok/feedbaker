"use client";

import toast from "react-hot-toast";

import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import { useUserMutation } from "@/features/users/mutations";

export default function LoginPage() {
  const createMutation = useUserMutation("onCreate");

  const onGoogleSignIn = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        toast.error("Google Sign-In failed: No credential received");
        return;
      }
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
