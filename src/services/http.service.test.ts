import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import MockAdapter from "axios-mock-adapter";
import httpService, {
  http,
  httpToken,
  setAuthFailureHandler,
} from "./http.service";
import localStorageService from "./local.storage.services";
import { toast } from "react-toastify";

vi.mock("./local.storage.services", () => ({
  default: {
    getAccessToken: vi.fn(),
    getRefreshToken: vi.fn(),
    getTokenExpiresDate: vi.fn(),
    setTokens: vi.fn(),
    removeAuthData: vi.fn(),
    getUserId: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("../configFile.json", () => ({
  default: {
    apiEndpoint: "https://test-firebase.firebaseio.com/",
    isFireBase: true,
  },
}));

describe("httpService", () => {
  let mockHttp: MockAdapter;
  let mockToken: MockAdapter;

  beforeEach(() => {
    mockHttp = new MockAdapter(http);
    mockToken = new MockAdapter(httpToken);
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockHttp.restore();
    mockToken.restore();
  });

  describe("Request Interceptor", () => {
    it("must add .json to URL and auth token to query params", async () => {
      vi.mocked(localStorageService.getAccessToken).mockReturnValue(
        "test-access-token",
      );
      vi.mocked(localStorageService.getTokenExpiresDate).mockReturnValue(
        String(Date.now() + 1000 * 60 * 10),
      );

      mockHttp.onGet(/users\.json/).reply((config) => {
        expect(config.params?.auth).toBe("test-access-token");
        return [200, { user1: { name: "Alice" } }];
      });

      await httpService.get("users");
    });
  });

  describe("Response Interceptor: Normalization", () => {
    it("must convert Firebase dictionary to array of objects with _id and wrap in content", async () => {
      const firebaseData = {
        key1: { title: "Task 1" },
        key2: { title: "Task 2" },
      };

      mockHttp.onGet(/tasks\.json/).reply(200, firebaseData);

      const response = await httpService.get("tasks");

      expect(response.data).toEqual({
        content: [
          { _id: "key1", title: "Task 1" },
          { _id: "key2", title: "Task 2" },
        ],
      });
    });

    it("must not break regular arrays or primitives, keeping them in content", async () => {
      mockHttp.onGet(/status\.json/).reply(200, "OK");

      const response = await httpService.get("status");

      expect(response.data).toEqual({ content: "OK" });
    });
  });

  describe("Error Handling & Retry Flow", () => {
    it("must show toast on 500 server error", async () => {
      mockHttp.onGet(/error\.json/).reply(500);

      await expect(httpService.get("error")).rejects.toThrow();
      expect(toast.error).toHaveBeenCalledWith(
        "Something went wrong. Try it later",
      );
    });

    it("must not show toast on 4xx client errors (except refresh)", async () => {
      mockHttp.onGet(/notfound\.json/).reply(404);

      await expect(httpService.get("notfound")).rejects.toThrow();
      expect(toast.error).not.toHaveBeenCalled();
    });

    it("must refresh token and retry original request on 401", async () => {
      vi.mocked(localStorageService.getRefreshToken).mockReturnValue(
        "valid-refresh-token",
      );
      mockToken.onPost(/token/).reply(200, {
        refresh_token: "new-refresh-token",
        id_token: "new-id-token",
        expires_in: 3600,
        user_id: "user-123",
      });

      mockHttp
        .onGet(/protected\.json/)
        .replyOnce(401)
        .onGet(/protected\.json/)
        .replyOnce(200, { success: true });

      const response = await httpService.get("protected");

      expect(localStorageService.setTokens).toHaveBeenCalledWith(
        expect.objectContaining({
          refreshToken: "new-refresh-token",
          idToken: "new-id-token",
        }),
      );
      expect(response.data.content).toEqual({ success: true });
    });

    it("must clear session and call onAuthFailure if refresh fails with 4xx error", async () => {
      const authFailureSpy = vi.fn();
      setAuthFailureHandler(authFailureSpy);

      vi.mocked(localStorageService.getRefreshToken).mockReturnValue(
        "revoked-refresh-token",
      );

      mockToken.onPost(/token/).reply(400);
      mockHttp.onGet(/protected\.json/).reply(401);

      await expect(httpService.get("protected")).rejects.toThrow();

      expect(localStorageService.removeAuthData).toHaveBeenCalled();
      expect(authFailureSpy).toHaveBeenCalled();
    });
  });
});
