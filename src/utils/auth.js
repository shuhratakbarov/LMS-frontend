import { AUTH_DATA } from "./local-storage-keys";
import { logout, refreshToken } from "../services/api-client";
import { message } from "antd";

export const getAccessToken = () => {
  const authData = localStorage.getItem(AUTH_DATA);
  if (!authData) return null;
  return JSON.parse(authData).accessToken;
};

export const getRefreshToken = () => {
  const authData = localStorage.getItem(AUTH_DATA);
  if (!authData) return null;
  return JSON.parse(authData).refreshToken;
};

export const isAccessTokenExpired = () => {
  const authData = localStorage.getItem(AUTH_DATA);
  if (!authData) return true;
  const { accessExpiration } = JSON.parse(authData);
  return new Date().getTime() >= accessExpiration;
};

export const setAuthData = (data) => {
  const authData = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessExpiration: data.accessExpiration,
    user: data.user,
  };
  localStorage.setItem(AUTH_DATA, JSON.stringify(authData));
};

export const deleteAuthData = () => {
  localStorage.removeItem(AUTH_DATA);
};

export const getUserCredentials = () => {
  const authData = localStorage.getItem(AUTH_DATA);
  if (!authData) return null;
  return JSON.parse(authData).user;
};

export const canUserLogin = () => {
  if (!isAccessTokenExpired()) {
    return true;
  }
  const token = getAccessToken();
  if (token && isAccessTokenExpired() && getRefreshToken()) {
    try {
      const refreshResponse = refreshToken();
      if (refreshResponse?.data?.success) {
        setAuthData(refreshResponse.data.data);
        return true;
      }
    } catch (error) {
      deleteAuthData();
      return false;
    }
  }
  deleteAuthData();
  return false;
};

export const handleLogout = async (navigate) => {
  try {
    const token = getAccessToken();
    if (!token) {
      deleteAuthData();
      navigate("/login");
      message.info("Session already expired");
      return;
    }
    const response = await logout(token); // Await the logout call
    if (response.data.success) {
      deleteAuthData();
      navigate("/login");
      message.success("Logged out successfully");
      window.location.reload();
    } else {
      deleteAuthData();
      navigate("/login");
      message.error(response.data.message || "Logout failed");
    }
  } catch (error) {
    deleteAuthData();
    navigate("/login");
    message.error("Logout failed: " + error.message);
  }
};