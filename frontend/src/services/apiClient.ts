import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5109";

const TOKEN_KEY = "moldova-travel.token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Axios instance — shared by services and AxiosProvider
export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach JWT token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Convenience wrappers used by service classes
export const api = {
  get:    <T>(path: string)                 => axiosInstance.get<T>(path).then((r) => r.data),
  post:   <T>(path: string, body?: unknown) => axiosInstance.post<T>(path, body).then((r) => r.data),
  put:    <T>(path: string, body?: unknown) => axiosInstance.put<T>(path, body).then((r) => r.data),
  delete: <T>(path: string)                 => axiosInstance.delete<T>(path).then((r) => r.data),
};
