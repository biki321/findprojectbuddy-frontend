import axios, { AxiosRequestConfig } from "axios";
import React, { useContext, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { IJwtPayload } from "../interfaces/iJwtPayload.interface";
import { useAuth } from "./AuthContext";

const axiosIns = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const AxiosInterceptContext = React.createContext(axiosIns);

interface IProps {
  children: JSX.Element;
}

export function useAxiosIntercept() {
  return useContext(AxiosInterceptContext);
}

export function AxiosInterceptContextProvider({ children }: IProps) {
  const { authState, refreshToken } = useAuth();
  const axiosIntercept = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
      "Content-Type": "application/json",
    },
  });
  useEffect(() => {
    axiosIntercept.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        const currentDate = new Date();
        console.log("intercept");
        console.log(authState);
        if (!authState.accessToken) {
          console.log("not acc at intercept token");
          return Promise.reject("accessToken is null");
        }
        const { exp } = jwt_decode<IJwtPayload>(authState.accessToken);
        if (exp * 1000 < currentDate.getTime()) {
          const token = await refreshToken();
          console.log("new tok at intercep", token);
          if (!token) return Promise.reject("could not get new token");
          config.headers["Authorization"] = `token ${token}`;
        }
        return config;
      }
    );
  }, []);

  return (
    <AxiosInterceptContext.Provider value={axiosIntercept}>
      {children}
    </AxiosInterceptContext.Provider>
  );
}