import axios from "axios";

export function getAxiosErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error || err.message || "Unexpected error";
  }
  return "Unexpected error";
}
