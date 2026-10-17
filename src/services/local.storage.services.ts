const TOKEN_KEY = "jwt-token";
const REFRESH_KEY = "jwt-refresh-token";
const EXPIRES_KEY = "jwt-expires";
const USERID_KEY = "user-local-id";

interface SetTokensParams {
  refreshToken: string;
  idToken: string;
  localId: string;
  expiresIn?: number | string;
  stayOn?: boolean;
}

export function setTokens({
  refreshToken,
  idToken,
  localId,
  expiresIn = 3600,
  stayOn,
}: SetTokensParams) {
  const expiresDate = new Date().getTime() + Number(expiresIn) * 1000;

  const isStayOn =
    typeof stayOn === "boolean" ? stayOn : !sessionStorage.getItem(REFRESH_KEY);

  const targetStorage = isStayOn ? localStorage : sessionStorage;
  const alternateStorage = isStayOn ? sessionStorage : localStorage;

  alternateStorage.removeItem(USERID_KEY);
  alternateStorage.removeItem(TOKEN_KEY);
  alternateStorage.removeItem(REFRESH_KEY);
  alternateStorage.removeItem(EXPIRES_KEY);

  targetStorage.setItem(USERID_KEY, localId);
  targetStorage.setItem(TOKEN_KEY, idToken);
  targetStorage.setItem(REFRESH_KEY, refreshToken);
  targetStorage.setItem(EXPIRES_KEY, expiresDate.toString());
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return (
    localStorage.getItem(REFRESH_KEY) || sessionStorage.getItem(REFRESH_KEY)
  );
}

export function getTokenExpiresDate(): string | null {
  return (
    localStorage.getItem(EXPIRES_KEY) || sessionStorage.getItem(EXPIRES_KEY)
  );
}

export function getUserId(): string | null {
  return localStorage.getItem(USERID_KEY) || sessionStorage.getItem(USERID_KEY);
}

export function removeAuthData(): void {
  [localStorage, sessionStorage].forEach((storage) => {
    storage.removeItem(USERID_KEY);
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(REFRESH_KEY);
    storage.removeItem(EXPIRES_KEY);
  });
}

const localStorageService = {
  setTokens,
  getAccessToken,
  getRefreshToken,
  getTokenExpiresDate,
  getUserId,
  removeAuthData,
};

export default localStorageService;
