import { httpAuth } from "./http.service";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface FirebaseAuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const authService = {
  register: async ({
    email,
    password,
  }: AuthCredentials): Promise<FirebaseAuthResponse> => {
    const { data } = await httpAuth.post<FirebaseAuthResponse>(
      "accounts:signUp",
      {
        email,
        password,
        returnSecureToken: true,
      },
    );
    return data;
  },

  login: async ({
    email,
    password,
  }: AuthCredentials): Promise<FirebaseAuthResponse> => {
    const { data } = await httpAuth.post<FirebaseAuthResponse>(
      "accounts:signInWithPassword",
      {
        email,
        password,
        returnSecureToken: true,
      },
    );
    return data;
  },
};

export default authService;
