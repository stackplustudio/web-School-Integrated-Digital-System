"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      
      if (res.data.access_token) {
        // Simpan token ke cookie
        Cookies.set("token", res.data.access_token, { expires: 1 }); // Expire 1 hari
        toast.success(`Selamat datang, ${res.data.user.name}!`);
        // Tendang ke halaman dashboard
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error("❌ Gagal: " + (error.response?.data?.message || "Kredensial salah"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Background utama menggunakan Soft Neutral #FBFBF3
    <main className="min-h-screen bg-[#FBFBF3] flex flex-col items-center justify-center p-4">
      
      <div className="text-center mb-10">
        {/* Teks Heading menggunakan warna Navy #00232C */}
        <h1 className="text-4xl font-bold tracking-tight text-[#00232C] mb-2">SmartSchool</h1>
        <p className="text-[#00232C]/60 font-medium">School Integrated Digital System</p>
      </div>

      {/* Container Login dengan efek Glassmorphism Standard, Shadow Large, dan Radius 20px */}
      <div className="w-full max-w-md p-8 bg-white/60 backdrop-blur-[20px] border border-white/55 rounded-[20px] shadow-[0_20px_50px_rgba(0,35,44,0.10)]">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-[#00232C]">Masuk ke Portal</h2>
          <p className="text-[14px] text-[#00232C]/60 mt-1">Gunakan email dan password Anda</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Form Input dengan jarak label 8px (mb-2) */}
          <div className="flex flex-col">
            <label className="text-[14px] font-semibold text-[#00232C] mb-2">
              Email
            </label>
            <Input 
              type="email" 
              placeholder="budicahyono@gmail.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={isLoading}
              className="h-[48px] rounded-[14px] px-4 border-[#00232C]/15 focus-visible:ring-[#0053FF] bg-white/50"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[14px] font-semibold text-[#00232C] mb-2">
              Password
            </label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={isLoading}
              className="h-[48px] rounded-[14px] px-4 border-[#00232C]/15 focus-visible:ring-[#0053FF] bg-white/50"
            />
          </div>

          {/* Button Primary Blue dengan radius 9999px (Pill) dan interaksi hover naik 1px */}
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-[48px] rounded-full bg-[#0053FF] hover:bg-[#0047D9] text-white font-medium transition-transform duration-200 hover:-translate-y-[1px] mt-2"
          >
            {isLoading ? "Memverifikasi..." : "Sign In"}
          </Button>
        </form>
      </div>
    </main>
  );
}