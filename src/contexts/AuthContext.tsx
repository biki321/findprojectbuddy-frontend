import React, { useContext, useEffect, useState, useCallback } from "react";
import axiosIns from "../services/axiosIns";

interface IContextProps {
  authState: IAuthState;
  login(code: string, callback: () => void): Promise<void>;
  refreshToken(): Promise<string | null>;
  logout: (callback: () => void) => void;
}

interface IProps {
  children: JSX.Element;
}

const AuthContext = React.createContext({} as IContextProps);

interface IUser {
  avatar: string;
  email: string | null;
  githubId: number;
  githubUrl: string;
  handle: string;
  id: number;
  name: string;
  tokenVersion: number;
  bio: string | null;
}

interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: IProps) {
  // const [accessToken, setAccessToken] = useState(null);
  // const [user, setUser] = useState(null);
  // const [isLoading, setLoading] = useState(true);
  // const [isAuthenticated, setAuthenticated] = useState(false);

  const [authState, setAuthState] = useState({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  } as IAuthState);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await axiosIns.get("auth/refreshToken", {
        withCredentials: true,
      });
      const token = res.headers["authorization"];
      console.log(token);
      setAuthState({
        user: res.data,
        accessToken: token,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      return token;
    } catch (error) {
      setAuthState({
        user: null,
        accessToken: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      return null;
    }
  }, []);

  const login = useCallback(async (code: string, callback) => {
    setAuthState({ ...authState, isLoading: true });
    try {
      const res = await axiosIns.get(`auth/login/${code}`, {
        withCredentials: true,
      });
      const token = res.headers["authorization"];
      console.log(token);
      callback();
      setAuthState({
        user: res.data,
        accessToken: token,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      setAuthState({
        user: null,
        accessToken: null,
        isLoading: false,
        isAuthenticated: false,
        error: "sorry login failed",
      });
    }
  }, []);

  const logout = async (callback: () => void) => {
    await axiosIns.get("auth/logout", {
      withCredentials: true,
      headers: {
        Authorization: `token ${authState.accessToken}`,
      },
    });

    setAuthState({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });
  };

  const values = {
    authState,
    login,
    refreshToken,
    logout,
  };

  useEffect(() => {
    (async () => {
      console.log("useeffect at authcontxt");
      await refreshToken();
    })();
  }, [refreshToken]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
