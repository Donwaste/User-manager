import { isAxiosError } from "axios";

interface FirebaseErrorResponse {
  error?: {
    code: number;
    message: string;
    errors?: Array<{ message: string; reason: string }>;
  };
  message?: string;
}

const authErrorMap: Record<string, string> = {
  INVALID_PASSWORD: "Incorrect email or password",
  EMAIL_NOT_FOUND: "Incorrect email or password",
  INVALID_LOGIN_CREDENTIALS: "Incorrect email or password",
  EMAIL_EXISTS: "User with this email already exists",
  TOO_MANY_ATTEMPTS_TRY_LATER: "Too many failed attempts. Try again later",
};

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;

  if (isAxiosError<FirebaseErrorResponse | string>(error)) {
    const data = error.response?.data;

    if (typeof data === "string") return data;

    const firebaseMessage = data?.error?.message;
    if (firebaseMessage) {
      if (authErrorMap[firebaseMessage]) {
        return authErrorMap[firebaseMessage];
      }
      return firebaseMessage;
    }

    if (data?.message) return data.message;
    return error.message;
  }

  if (error instanceof Error) return error.message;

  return "An unexpected error occurred";
};
