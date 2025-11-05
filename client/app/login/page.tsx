"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { GoogleCredentialResponse } from "@/types/users";
import Script from "next/script";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // useEffect(() => {
  //   const fetchCsrfToken = async () => {
  //     const res = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/auth/csrf`,
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     localStorage.setItem("csrfToken", res.data.csrfToken);
  //   };

  //   fetchCsrfToken();
  // }, []);

  const handleCredentialResponse = async (
    response: GoogleCredentialResponse
  ) => {
    if (!response?.credential) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }

    try {
      // const csrfToken = localStorage.getItem("csrfToken");s
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
        { credential: response.credential },
        {
          withCredentials: true,
          // headers: {
          //   "X-CSRF-Token": csrfToken ?? "",
          // },
        }
      );

      toast.success("Signed in successfully!");
      router.push("/profile");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed. Please try again.");
      router.push("/login");
    }
  };

  const handleGoogleScriptLoad = () => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredentialResponse,
      auto_select: true,
      cancel_on_tap_outside: false,
      context: "signin",
      error_callback: () => {
        toast.error(
          "Google sign-in popup was blocked. Please refresh or try normal mode."
        );
      },
      use_fedcm_for_prompt: true,
    });

    const div = document.getElementById("googleLoginDiv");
    if (div) {
      window.google.accounts.id.renderButton(div, {
        theme: "outline",
        size: "large",
      });
    }

    //   window.google.accounts.id.prompt((notification) => {
    //     console.log(
    //       "One Tap:",
    //       notification.momentType,
    //       notification.reason || "no reason"
    //     );
    //     const moment = notification.momentType;
    //     const reason = notification.reason;
    //     console.log("FedCM moment:", moment, "reason:", reason);

    //     if (moment === "skipped" && reason) {
    //       toast("Google sign-in skipped: " + reason);
    //     }
    //   });
  };

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          setScriptLoaded(true);
          handleGoogleScriptLoad();
        }}
      />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Feedbaker Login</h1>
        {!scriptLoaded && <p>Loading Google Login...</p>}
        <div id="googleLoginDiv"></div>
      </main>
    </>
  );
}
