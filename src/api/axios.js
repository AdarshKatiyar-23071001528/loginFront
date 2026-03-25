import axios from 'axios';
import { getAuthToken } from "../utils/auth";

// import.meta.env.VITE_API_URL||
const api = axios.create({
    baseURL:  "https://loginback.vercel.app/api" || "http://localhost:1000/api" 
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
