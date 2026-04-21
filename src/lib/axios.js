import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://cms-server-x0wv.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
