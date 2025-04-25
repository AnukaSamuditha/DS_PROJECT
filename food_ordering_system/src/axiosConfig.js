import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_PREFIX,
  withCredentials: true, // 🔑 allow cookies to be sent
});

export default axiosInstance;
