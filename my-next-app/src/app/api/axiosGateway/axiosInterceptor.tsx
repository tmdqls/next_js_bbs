import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: typeof window === "undefined" ? "http://localhost:3000" : "",
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized, please log in again.");
          break;
        case 403:
          console.error("Forbidden, you do not have access.");
          break;
        case 500:
          console.error("Server Error, try again later.");
          break;
        default:
          console.error("An unexpected error occurred.", error);
      }
    } else if (error.request) {
      console.error("Network Error or No Response from server.");
    } else {
      console.error("Error", error);
    }

    return Promise.reject(error);
  }
);

const axiosInterceptor: AxiosInstance = axiosInstance;

export default axiosInterceptor;