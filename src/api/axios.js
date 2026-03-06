import axios from 'axios';

const api = axios.create({
    baseURL:"https://loginback.vercel.app/api"
    // baseURL: "http://localhost:1000/api"
});

export default api;