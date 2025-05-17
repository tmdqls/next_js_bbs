import axios from "axios";

const axiosAuthInstance = axios.create({
  baseURL: typeof window === "undefined" ? "http://localhost:3000" : "",
});

export default axiosAuthInstance;