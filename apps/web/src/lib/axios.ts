import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
  // PERBAIKAN: Wajib menggunakan environment variable agar dinamis (Dev vs Prod) sesuai README
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Otomatis menempelkan JWT Token ke setiap request ke backend
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});