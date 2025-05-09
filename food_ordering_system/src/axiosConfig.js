import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_RESTAURANT_SERVICE_PREFIX,
  withCredentials: true,
});

export default axiosInstance;
