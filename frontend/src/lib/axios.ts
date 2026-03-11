import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://taskmanager-backend-zb7j.onrender.com/api',
  // baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
