import { absoluteURL } from "@/config/env";
import { UserPayload } from "@/types/users";
import { authenticatedUserSchema, userSchema } from "@/validations/users";
import axios from "axios";

export const fetchProfile = async (): Promise<UserPayload | null> => {
  try {
    const response = await axios.get(`${absoluteURL}/api/profile`, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      withCredentials: true,
    });
    const result = userSchema.safeParse(response.data);
    if (!result.success) {
      throw new Error("Invalid server response");
    }

    return result.data;
  } catch {
    return null;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    const response = await axios.post(`${absoluteURL}/api/logout`, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      withCredentials: true,
    });
    if (!response) {
      throw new Error("Invalid server response");
    }
    return true;
  } catch (error: unknown) {
    console.error("Failed to logout:", error);
    return false;
  }
};

export const handleCredentialResponse = async (
  credential: string
): Promise<UserPayload | null> => {
  try {
    const response = await axios.post(
      `${absoluteURL}/api/auth/google`,
      { credential },
      {
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
        withCredentials: true,
      }
    );
    const result = authenticatedUserSchema.safeParse(response.data);

    if (!result.success) {
      throw new Error("Invalid server response");
    }

    return result.data.userPayload;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return null;
  }
};
