import axios from "axios";

export const api = axios.create({
  // Prioritas 1: Ambil dari Environment Variable (Vercel / .env.local)
  // Prioritas 2: Jika kosong, arahkan ke Railway secara otomatis (supaya lokal langsung tembus tanpa perlu nyalakan backend lokal)
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://web-school-integrated-digital-system-production.up.railway.app",
});

// 🔥 Interceptor Token JWT Anda
api.interceptors.request.use(
  (config) => {
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // 🔥 TAMBAHAN KUNCI: Jangan redirect jika user sedang berada di halaman login
        if (!window.location.pathname.includes("/auth/login")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);