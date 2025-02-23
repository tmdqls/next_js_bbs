import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9999",
});

export default axiosInstance;