import axios from 'axios';
import { getAuthToken } from "../utils/auth";

const isLocalHost = typeof window !== "undefined" && [
    "localhost",
    "127.0.0.1",
].includes(window.location.hostname);

const resolvedBaseUrl =
    import.meta.env.VITE_API_URL ||
    (isLocalHost
        ? "http://localhost:1000/api"
        : "https://loginback.vercel.app/api");

const api = axios.create({
    baseURL: resolvedBaseUrl,
});

api.interceptors.request.use((config) => {
    const token = getAuthToken();

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
