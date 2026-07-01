import axios from "axios";

export const AUTH_TOKEN_KEY = "aiInterview_authToken";

axios.interceptors.request.use((config) => {
  const t = localStorage.getItem(AUTH_TOKEN_KEY);
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});
