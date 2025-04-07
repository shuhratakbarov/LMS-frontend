import axiosInstance from "./host";
import { createContext, useContext, useState } from "react";

const AxiosContext = createContext();

export const AxiosProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (err) => {
    if (err.response) {
      // Server-side errors (e.g., 4xx, 5xx)
      return err.response.data.message || "Something went wrong on the server";
    } else if (err.request) {
      // Network errors
      return "Network error. Please check your connection.";
    } else {
      // Other errors
      return err.message;
    }
  };

  const get = (endpoint, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      return axiosInstance.get(endpoint, { params });
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const post = (endpoint, data) => {
    setLoading(true);
    setError(null);
    try {
      return axiosInstance.post(endpoint, data);
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const put = (endpoint, data) => {
    setLoading(true);
    setError(null);
    try {
      return axiosInstance.put(endpoint, data);
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const delete_ = (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      return axiosInstance.delete(endpoint);
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AxiosContext.Provider value={{ get, post, put, delete_, loading, error }}>
      {children}
    </AxiosContext.Provider>
  );
};

export const useAxios = () => useContext(AxiosContext);
