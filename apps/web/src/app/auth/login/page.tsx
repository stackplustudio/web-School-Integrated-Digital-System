"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Lock, Mail, ArrowRight } from "lucide-react";
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
      
      // Kita gunakan window.location.href agar browser benar-benar
      // me-refresh state dan Sidebar bisa membaca role terbaru
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
    <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[30px] p-8 shadow-[0_10px_40px_rgba(0,35,44,0.08)]">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0053FF]/10 text-[#0053FF] mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#00232C]">Selamat Datang</h1>
          <p className="text-gray-500 text-sm mt-2">Masuk ke SIDS (School Integrated Digital System)</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#00232C]">Email Pengguna</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              <Input 
                type="email" 
                required 
                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-[#0053FF] focus:ring-[#0053FF]"
                placeholder="budi@stackplustudio.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#00232C]">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <Input 
                type="password" 
                required 
                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-[#0053FF] focus:ring-[#0053FF]"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 mt-4 bg-[#0053FF] hover:bg-[#0047D9] text-white rounded-xl text-md font-semibold flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? "Memverifikasi..." : "Masuk ke Dashboard"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </Button>
        </form>

      </div>
    </div>
  );
}