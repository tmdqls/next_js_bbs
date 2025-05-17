import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import axiosAuthInstance from "../axiosInstance/axiosAuthInstance";
import { ErrorCodes } from "@/lib/Common/ErrorCodes";

axiosAuthInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken =
    document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1] ?? "";
    // アクセストークンの有効性を確認
    console.log(accessToken,"이제 반환은되?")
    if(!accessToken){
      throw new Error(ErrorCodes.INVALID_TOKEN.message);
    }
    
    // アクセストークンをヘッダーに追加
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosAuthInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // アクセストークンエラー時
    if (
      error.response.status === ErrorCodes.INVALID_TOKEN.status &&
      error.response.data.message === ErrorCodes.INVALID_TOKEN.message
    ) {
      try {
        // リフレッシュトークンを使って新しいアクセストークンをリクエスト
        await axios.post(
          "/api/auth/getAccessToken",
          {},
          {
            withCredentials: true,
          }
        );

        // 新しく取得したアクセストークンを元のリクエストに追加
        const accessToken =
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1] ?? "";

        error.config.headers["Authorization"] = `Bearer ${accessToken}`;

        // リクエストを再送信
        return axios(error.config);
      } catch (err) {
        console.error("アクセストークンの更新中にエラーが発生しました:", err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

const axiosAuthGateway: AxiosInstance = axiosAuthInstance;

export default axiosAuthGateway;
