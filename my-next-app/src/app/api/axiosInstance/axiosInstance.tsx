import axios from "axios";

const axiosInstance = axios.create({
  baseURL: typeof window === "undefined" ? "http://localhost:3000" : "",
});

export default axiosInstance;