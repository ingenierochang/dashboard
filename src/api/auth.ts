// src/app/auth/utils.ts
import Cookies from "js-cookie";
import client from "@/api";
import { jwtDecode, JwtPayload } from "jwt-decode";

const storeToken = (token: string, type: "access" | "refresh") => {
  Cookies.set(type + "Token", token);
};

const getToken = (type: "access" | "refresh") => {
  return Cookies.get(type + "Token");
};

const removeTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

const register = async (email: string, username: string, password: string) => {
  return (
    await client.post("/api/accounts/register/", { email, username, password })
  ).data;
};

const login = async (email: string, password: string) => {
  return (
    await client.post("/api/accounts/login/", { username: email, password })
  ).data;
};

const logout = async () => {
  const refreshToken = getToken("refresh");
  return (await client.post("/auth/logout/", { refresh: refreshToken })).data;
};

const handleJWTRefresh = async () => {
  const refreshToken = getToken("refresh");
  return (await client.post("/auth/jwt/refresh", { refresh: refreshToken }))
    .data;
};

const resetPassword = async (email: string) => {
  return (await client.post("/auth/users/reset_password/", { email })).data;
};

const resetPasswordConfirm = async (
  newPassword: string,
  reNewPassword: string,
  token: string,
  uid: string
) => {
  return (
    await client.post("/auth/users/reset_password_confirm/", {
      uid,
      token,
      new_password: newPassword,
      re_new_password: reNewPassword,
    })
  ).data;
};

const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  const { exp } = jwtDecode<JwtPayload>(token);
  if (!exp) return true;

  return Date.now() >= exp * 1000;
};

export const AuthActions = () => {
  return {
    login,
    resetPasswordConfirm,
    handleJWTRefresh,
    register,
    resetPassword,
    storeToken,
    getToken,
    logout,
    removeTokens,
    isTokenExpired,
  };
};
