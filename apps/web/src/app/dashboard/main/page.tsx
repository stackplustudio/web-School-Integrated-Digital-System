"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Users, GraduationCap, Briefcase, Library, Activity, CalendarClock } from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard-stats/admin-overview");
        setData(res.data);
      } catch (error) {
        toast.error("Gagal memuat data statistik.");
      } finally {
        setIsLoading(false);
      }
    };

    const user = localStorage.getItem("user");
    if (user) {
      setUserName(JSON.parse(user).name);
    }

    fetchStats();
  }, []);

  if (isLoading) return <div className="p-8">Memuat Analytics...</div>;

  const statCards = [
    { title: "Total Siswa Aktif", value: data?.statistik.totalSiswa || 0, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Guru", value: data?.statistik.totalGuru || 0, icon: Briefcase, color: "text-teal-600", bg: "bg-teal-100" },
    { title: "Rombongan Belajar", value: data?.statistik.totalKelas || 0, icon: Library, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Pendaftar PPDB", value: data?.statistik.totalPendaftar || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-[#0053FF] rounded-[24px] p-8 md:p-10 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Selamat Datang, {userName}! 👋</h1>
          <p className="text-blue-100 max-w-xl">
            Sistem Informasi Digital Sekolah (SIDS) berjalan dengan baik. Berikut adalah ringkasan operasional akademik untuk hari ini.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
            <CalendarClock className="w-4 h-4" />
            {data?.informasi_akademik}
          </div>
        </div>
        {/* Dekorasi Abstrak */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-10 -mt-20 pointer-events-none"></div>
      </div>

      {/* Grid Statistik */}
      <h2 className="text-xl font-bold text-[#00232C] flex items-center gap-2">
        <Activity className="text-[#0053FF]" /> Ikhtisar Data
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] p-6 shadow-[0_10px_30px_rgba(0,35,44,0.08)] flex items-center gap-5 transition-transform hover:-translate-y-1">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-[#00232C]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}