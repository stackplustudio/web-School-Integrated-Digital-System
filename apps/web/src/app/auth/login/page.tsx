"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Tembak API Login
      const res = await api.post("/auth/login", formData);
      
      // 2. Simpan token dan data user
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login berhasil!");

      // 3. Routing Otomatis Berdasarkan Role
      const userRole = res.data.user.role;
      
      if (userRole === "SISWA") {
        window.location.href = "/dashboard/student-portal";
      } else if (userRole === "GURU") {
        window.location.href = "/dashboard/lms";
      } else {
        window.location.href = "/dashboard/main"; // Admin / SuperAdmin
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Email atau Password salah");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Latar belakang utama (Warna biru SIDS agar selaras dengan brand)
    <div className="min-h-screen bg-[#0053FF] flex items-center justify-center p-4 lg:p-0 relative overflow-hidden">
      
      {/* Dekorasi Cahaya Tipis (Opsional untuk estetika) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center gap-10 lg:gap-20 relative z-10 p-4">
        
        {/* ================= BAGIAN KIRI (TEKS & LOGO) ================= */}
        <div className="hidden lg:flex flex-col w-1/2 text-white pr-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white p-2 rounded-xl">
              {/* Memanggil logo.jpg dari folder public */}
              <img src="/logo.jpg" alt="Logo" className="h-10 w-auto object-contain rounded-lg" />
            </div>
            <span className="text-2xl font-bold tracking-wide">SIDS Portal</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 leading-tight">Hey, Hello!</h1>
          <p className="text-xl text-blue-100 font-medium mb-6">
            School Integrated Digital System
          </p>
          <p className="text-sm text-blue-200/80 max-w-md leading-relaxed">
            Kami menyediakan platform digital terpadu untuk menyederhanakan seluruh operasional akademik dan transaksi finansial sekolah tanpa kendala tambahan.
          </p>
        </div>

        {/* ================= BAGIAN KANAN (KARTU FORM) ================= */}
        <div className="w-full lg:w-1/2 max-w-[480px] mx-auto">
          <div className="bg-white rounded-[40px] p-8 sm:p-12 shadow-2xl">
            
            {/* Logo Mobile (Hanya muncul di layar kecil) */}
            <div className="lg:hidden flex justify-center mb-8">
               <img src="/logo.jpg" alt="Logo" className="h-14 w-auto object-contain rounded-2xl shadow-sm" />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-500 text-sm">Silakan masuk menggunakan kredensial Anda.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="space-y-2">
                <Input 
                  type="email" 
                  required 
                  className="h-14 bg-white border-gray-200 focus:border-[#0053FF] focus:ring-1 focus:ring-[#0053FF] rounded-2xl px-5 text-md"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Input 
                  type="password" 
                  required 
                  className="h-14 bg-white border-gray-200 focus:border-[#0053FF] focus:ring-1 focus:ring-[#0053FF] rounded-2xl px-5 text-md"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-1">
                <a href="#" className="text-sm text-[#0053FF] font-medium hover:underline">Forgot Password?</a>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 mt-2 bg-[#0053FF] hover:bg-[#0047D9] text-white rounded-full text-md font-bold transition-all shadow-lg shadow-blue-500/30"
              >
                {isLoading ? "Memverifikasi..." : "Login"}
              </Button>

              {/* Or Divider (Estetika UI sesuai referensi) */}
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase">OR</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              {/* Dummy Social Buttons (Estetika UI sesuai referensi) */}
              <div className="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline" className="h-12 rounded-full border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
                  Google
                </Button>
                <Button type="button" variant="outline" className="h-12 rounded-full border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">
                  <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5 mr-2" />
                  Facebook
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-8 pt-4">
                <p className="text-sm text-gray-600 font-medium">
                  Don't have an account? <a href="#" className="text-[#0053FF] hover:underline font-bold">Sign Up</a>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}