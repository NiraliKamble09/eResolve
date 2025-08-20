// src/services/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8082';

const api = axios.create({
  baseURL: BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// ✅ Attach token dynamically to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Template literal fix
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;