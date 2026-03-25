import axios from 'axios';
import { getAuthToken } from "../utils/auth";

// import.meta.env.VITE_API_URL||  "http://localhost:1000/api" ||
const api = axios.create({
    baseURL:  "https://loginback.vercel.app/api"
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
