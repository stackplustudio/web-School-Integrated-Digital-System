"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { 
  BookOpen, Users, CreditCard, LayoutDashboard, 
  Calendar, Bell, LogOut, GraduationCap, ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }
    
    try {
      // Decode JWT Payload untuk membaca Role dan Nama tanpa memanggil API tambahan
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      setUser(JSON.parse(jsonPayload));
    } catch (e) {
      Cookies.remove("token");
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FBFBF3] flex items-center justify-center text-[#00232C]">
        Memuat Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBF3]">
      {/* Navbar Glassmorphism */}
      <nav className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-[20px] border-b border-white/55 shadow-[0_4px_12px_rgba(0,35,44,0.05)] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-[#0053FF]" />
          <span className="text-xl font-bold text-[#00232C]">SmartSchool</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#00232C]/60 hover:text-[#0053FF] transition-colors rounded-full hover:bg-white/50">
            <Bell className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-[#0053FF] flex items-center justify-center text-white font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            className="text-[#00232C] hover:text-red-600 rounded-full h-9 px-4"
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-[1280px] mx-auto px-5 md:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#00232C]">Halo, {user.name} 👋</h1>
          <p className="text-[#00232C]/60 mt-1">
            Anda login sebagai <span className="font-semibold text-[#0053FF]">{user.role.replace('_', ' ')}</span>
          </p>
        </div>

        {/* --- WIDGET BERDASARKAN ROLE --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Tampilan Khusus SISWA */}
          {user.role === "SISWA" && (
            <>
              <DashboardCard icon={<Calendar />} title="Jadwal Hari Ini" desc="Matematika (08:00 - 09:30)" color="bg-blue-50 text-[#0053FF]" />
              <DashboardCard icon={<BookOpen />} title="Tugas LMS" desc="2 Tugas belum dikumpulkan" color="bg-amber-50 text-amber-600" />
              <DashboardCard icon={<CreditCard />} title="Status SPP" desc="Bulan ini: Lunas" color="bg-green-50 text-green-600" />
            </>
          )}

          {/* Tampilan Khusus ADMIN (SISTEM / TU) */}
          {(user.role === "ADMIN_SISTEM" || user.role === "ADMIN_TU") && (
            <>
              <DashboardCard icon={<Users />} title="Total Siswa Aktif" desc="1,240 Siswa terdaftar" color="bg-blue-50 text-[#0053FF]" />
              <DashboardCard icon={<ClipboardList />} title="Pendaftar PPDB" desc="45 Berkas Menunggu Verifikasi" color="bg-amber-50 text-amber-600" />
              <DashboardCard icon={<LayoutDashboard />} title="Tahun Ajaran" desc="2026/2027 Ganjil Aktif" color="bg-green-50 text-green-600" />
            </>
          )}

          {/* Tampilan Khusus GURU / WALI KELAS */}
          {(user.role === "GURU" || user.role === "WALI_KELAS") && (
            <>
              <DashboardCard icon={<Calendar />} title="Jadwal Mengajar" desc="3 Kelas Hari Ini" color="bg-blue-50 text-[#0053FF]" />
              <DashboardCard icon={<BookOpen />} title="Tugas & Nilai" desc="15 Tugas perlu dinilai" color="bg-amber-50 text-amber-600" />
            </>
          )}

        </div>

      </main>
    </div>
  );
}

// Komponen Reusable Card sesuai Design System Stack Plus
function DashboardCard({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <div className="p-6 bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] shadow-[0_10px_30px_rgba(0,35,44,0.08)] flex items-start gap-4 transition-transform duration-200 hover:-translate-y-[4px]">
      <div className={`p-4 rounded-[14px] ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg text-[#00232C]">{title}</h3>
        <p className="text-[#00232C]/60 text-sm mt-1">{desc}</p>
      </div>
    </div>
  );
}