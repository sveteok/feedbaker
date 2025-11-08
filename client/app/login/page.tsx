"use client";

import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

import { GoogleCredentialResponse, UserPayload } from "@/types/users";
import { handleCredentialResponse } from "@/lib/fetchers/users/auth.client";
import { useAuth } from "@/lib/providers/AuthContext";
import { queryKeys } from "@/lib/react-query/queryKeys";

export default function LoginPage() {
  const { setUser } = useAuth();

  const queryClient = useQueryClient();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(true);
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
      router.push(`/`);
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (
      !googleScriptLoaded ||
      !googleButtonRef.current ||
      !window.google?.accounts?.id
    )
      return;

    const onGoogleSignIn = async (
      credentialResponse: GoogleCredentialResponse
    ) => {
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

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: onGoogleSignIn,
        cancel_on_tap_outside: false,
        context: "signin",
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: "250px",
      });
    } catch (error) {
      console.error("Failed to initialize Google button:", error);
    }
  }, [googleScriptLoaded, createMutation]);

  return (
    <main className="p-6">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Google script loaded");
          setGoogleScriptLoaded(true);
        }}
        onError={() => console.error("Failed to load Google script")}
      />
      <h1 className="text-2xl font-bold mb-4">Feedbaker Login</h1>
      <div ref={googleButtonRef}></div>
    </main>
  );
}
