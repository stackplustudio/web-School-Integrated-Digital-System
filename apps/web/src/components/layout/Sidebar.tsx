"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, UserPlus, GraduationCap, Briefcase, 
  BookOpen, Library, CalendarDays, LayoutDashboard, 
  UserCheck, LogOut, CheckSquare, BookMarked, FileText, Wallet,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setRole(user.role);
      } catch (error) {
        console.error("Gagal membaca role user");
      }
    } else {
      setRole("ADMIN_TU"); 
    }
  }, []);

  // Menu Dikelompokkan Berdasarkan Modul & Role
  
  const menuGroups = [
    {
      groupName: "Overview",
      roles: ["ADMIN_SISTEM", "ADMIN_TU"],
      items: [
        { name: "Dashboard Utama", path: "/dashboard/main", icon: LayoutDashboard }, // 🔥 Menu Baru
      ]
    },
    {
      groupName: "Penerimaan Siswa",
      roles: ["ADMIN_SISTEM", "ADMIN_TU"],
      items: [
        { name: "Manajemen PPDB", path: "/dashboard/ppdb", icon: Users },
        { name: "Daftar Ulang", path: "/dashboard/daftar-ulang", icon: UserPlus },
      ]
    },
    {
      groupName: "Master Data",
      roles: ["ADMIN_SISTEM", "ADMIN_TU"],
      items: [
        { name: "Master Siswa", path: "/dashboard/students", icon: GraduationCap },
        { name: "Master Guru", path: "/dashboard/teachers", icon: Briefcase },
        { name: "Data Mapel", path: "/dashboard/subjects", icon: BookOpen },
      ]
    },
    {
      groupName: "Akademik & KBM",
      roles: ["ADMIN_SISTEM", "ADMIN_TU"],
      items: [
        { name: "Manajemen Kelas", path: "/dashboard/classes", icon: Library },
        { name: "Penempatan", path: "/dashboard/enrollments", icon: UserCheck },
        { name: "Jadwal", path: "/dashboard/schedules", icon: CalendarDays },
        { name: "Perizinan & Cuti", path: "/dashboard/leave-requests", icon: FileText },
        { name: "Keuangan & SPP", path: "/dashboard/finance", icon: Wallet }, 
      ]
    },
    {
      groupName: "Ruang Guru",
      roles: ["GURU", "ADMIN_SISTEM", "ADMIN_TU"], // 🔥 Buka akses untuk Admin agar mudah ditest
      items: [
        { name: "Portal Guru (LMS)", path: "/dashboard/lms", icon: LayoutDashboard },
        { name: "Presensi Harian", path: "/dashboard/attendances", icon: CheckSquare },
        { name: "Penilaian & Rapor", path: "/dashboard/grades", icon: BookMarked }, 
      ]
    },
    {
      groupName: "Ruang Siswa",
      roles: ["SISWA"],
      items: [
        { name: "Portal Siswa", path: "/dashboard/student-portal", icon: LayoutDashboard },
        { name: "Perizinan & Cuti", path: "/dashboard/leave-requests", icon: FileText }, 
        { name: "Keuangan & SPP", path: "/dashboard/finance", icon: Wallet }, 
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  };

  return (
    // <aside className="w-72 bg-[#0053FF] min-h-screen rounded-r-[40px] flex flex-col relative z-20 shadow-xl flex-shrink-0">
    <aside className="w-72 bg-[#0053FF] h-screen sticky top-0 rounded-r-[40px] flex flex-col relative z-20 shadow-xl flex-shrink-0">
      

      {/* Logo Area */}
      <div className="p-8 pb-6 flex justify-center md:justify-start">
        <Image 
          src="/logo.jpg" 
          alt="Logo Sekolah" 
          width={500} 
          height={200} 
          // mix-blend-multiply dihapus
          // ditambahkan bg-white dan rounded-xl agar terlihat seperti kartu putih yang rapi
          className="w-52 h-14 object-cover object-center bg-white rounded-xl md:ml-[-10px]" 
          priority
        />
      </div>

      {/* Navigation List Dikelompokkan */}
      <div className="flex-1 px-0 py-2 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, groupIdx) => {
          // Hanya tampilkan grup jika role user diizinkan
          if (!role || !group.roles.includes(role)) return null;

          return (
            <div key={groupIdx} className="mb-6">
              <h3 className="px-10 text-[10px] uppercase tracking-wider font-bold text-blue-200 mb-2">
                {group.groupName}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;

                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      className={`relative flex items-center gap-4 pl-10 pr-6 py-3 mx-0 transition-all duration-300 ${
                        isActive 
                          ? "bg-[#F4F7FE] text-[#0053FF] rounded-l-full ml-4" 
                          : "text-white/70 hover:text-white hover:bg-white/10 mx-4 rounded-xl"
                      }`}
                    >
                      <Icon className={`w-5 h-5 z-10 ${isActive ? "text-[#0053FF]" : "text-blue-200"}`} />
                      <span className={`font-semibold text-sm z-10 ${isActive ? "text-[#0053FF]" : ""}`}>{item.name}</span>

                      {/* Efek Cutout */}
                      {isActive && (
                        <>
                          <div className="absolute right-0 -top-6 w-6 h-6 bg-transparent rounded-br-[24px] shadow-[10px_10px_0_10px_#F4F7FE] z-0 pointer-events-none" />
                          <div className="absolute right-0 -bottom-6 w-6 h-6 bg-transparent rounded-tr-[24px] shadow-[10px_-10px_0_10px_#F4F7FE] z-0 pointer-events-none" />
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Logout Area */}
      <div className="p-8 mt-auto border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-white/70 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm">Keluar Sistem</span>
        </button>
      </div>
      
      {/* CSS untuk Menyembunyikan Scrollbar tapi tetap bisa di-scroll */}
      <style jsx global>{`
        /* Untuk Chrome, Safari, dan Opera */
        .custom-scrollbar::-webkit-scrollbar { 
          display: none; 
        }
        /* Untuk IE, Edge, dan Firefox */
        .custom-scrollbar { 
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </aside>
  );
}