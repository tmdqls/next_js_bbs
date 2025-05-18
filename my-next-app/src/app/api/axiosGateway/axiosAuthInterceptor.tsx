import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { ErrorCodes } from "@/lib/Common/ErrorCodes";

const baseURL = typeof window === "undefined" ? "http://localhost:3000" : "";

const axiosAuthInstance: AxiosInstance = axios.create({
  baseURL,
});

axiosAuthInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let accessToken =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1] ?? "";

    if (!accessToken) {
      // アクセストークンがない場合、処理中断
      return Promise.reject(new Error(ErrorCodes.FORBIDDEN.message));
    }

    // アクセストークンチェック
    try {
      await axios.post(`${baseURL}/api/auth/accessTokenCheck`, { accessToken });
    } catch {
      try {
        // アクセストークンチェック失敗時、リフレッシュトークンにより再発行
        const getAccessTokenResponse = await axios.post(
          `${baseURL}/api/auth/getAccessToken`,
          {},
          { withCredentials: true }
        );
        accessToken = getAccessTokenResponse.data.accessToken;
      } catch (err) {
        console.log(err);
        // アクセストークン発行失敗時、処理中断
        return Promise.reject(new Error(ErrorCodes.FORBIDDEN.message));
      }
    }

    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${accessToken}`;

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosAuthInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosAuthInstance;
