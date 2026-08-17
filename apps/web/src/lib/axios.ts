import axios from "axios";

export const api = axios.create({
  // Pastikan URL dan Port ini sesuai dengan backend NestJS Anda
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

// 🔥 INI KUNCINYA: Axios Interceptor
// Kode ini akan mencegat setiap request yang akan dikirim,
// lalu otomatis menyelipkan Token JWT jika tokennya ada.
api.interceptors.request.use(
  (config) => {
    // Memastikan kode ini hanya berjalan di sisi Client (Browser)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Opsional: Tangkap error 401 secara global untuk menendang user ke halaman login jika token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // Hapus token yang kedaluwarsa dan lempar ke login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);