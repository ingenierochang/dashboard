// src/api/index.ts
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import qs from "qs";
import { AuthActions } from "./auth";

export const API_URL = import.meta.env.VITE_API_URL;

const REFRESH_TOKEN_PATH = "/api/accounts/token/refresh/";

const client = axios.create({
  baseURL: API_URL,
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: "brackets" }),
  },
});

// Request interceptor
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = AuthActions().getToken("access");
    console.log("!-- accessToken", accessToken);
    if (accessToken && config.url && !config.url.includes("token")) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = AuthActions().getToken("refresh");
      if (!refreshToken) {
        // If there's no refresh token, clear all tokens and redirect to login
        AuthActions().removeTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}${REFRESH_TOKEN_PATH}`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        AuthActions().storeToken(access, "access");

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${access}`;
        }

        return client(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear all tokens and redirect to login
        AuthActions().removeTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
