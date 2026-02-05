import axios from 'axios';

const api = axios.create({
    baseURL:"https://loginback.vercel.app/api/user"
    // baseURL: "http://localhost:1000/api/user"
});

export default api;