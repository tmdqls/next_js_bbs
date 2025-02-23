import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import axiosInstance from '../axiosInstance/axiosInstance';

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 예시: const token = localStorage.getItem('user_jwt');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

const axiosGateway: AxiosInstance = axiosInstance;

export default axiosGateway;