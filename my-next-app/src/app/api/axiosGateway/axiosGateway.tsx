import  { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import axiosInstance from '../axiosInstance/axiosInstance';

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //jwtトークンをcookieから取得
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='))?.split('=')[1];
    //jwtトークンをヘッダーに追加
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    //共通エラー処理
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
          console.error("An unexpected error occurred.");
      }
    } else if (error.request) {
      //サーバーエラー
      console.error("Network Error or No Response from server.");
    } else {
      console.error("Error", error.message);
    }

    return Promise.reject(error);
  }
);

const axiosGateway: AxiosInstance = axiosInstance;

export default axiosGateway;