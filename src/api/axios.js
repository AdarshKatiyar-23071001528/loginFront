import axios from 'axios';

const api = axios.create({
    baseURL:"https://loginback.vercel.app/api/user"
});

export default api;