import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? "https://bisaathi-server.vercel.app" : "http://localhost:5000"),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bis_user_token")
             || localStorage.getItem("bis_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
