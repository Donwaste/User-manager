import { AxiosError, isAxiosError } from "axios";

interface ApiErrorData {
  message?: string;
  error?: { message: string };
}

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;

  if (isAxiosError<ApiErrorData | string>(error)) {
    const data = error.response?.data;

    if (typeof data === "string") return data;
    if (data?.error?.message) return data.error.message;
    if (data?.message) return data.message;

    return error.message;
  }

  if (error instanceof Error) return error.message;

  return "Unknown error";
};
