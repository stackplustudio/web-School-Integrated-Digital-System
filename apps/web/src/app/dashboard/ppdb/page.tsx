"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPPDBPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk menarik data dari Backend
  const fetchApplicants = async () => {
    try {
      const res = await api.get("/ppdb");
      setApplicants(res.data);
    } catch (error) {
      toast.error("Gagal mengambil data pendaftar.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // Fungsi untuk update status kelulusan
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      // 🔥 Sinkronisasi: Jika DITERIMA maka status_verifikasi DITERIMA. Jika TIDAK_DITERIMA maka DITOLAK.
      const verifikasi = newStatus === "DITERIMA" ? "DITERIMA" : "DITOLAK";

      await api.patch(`/ppdb/${id}/status`, {
        status_verifikasi: verifikasi,
        status_kelulusan: newStatus, // Akan mengirim "DITERIMA" atau "TIDAK_DITERIMA"
      });
      toast.success(`Status berhasil diubah`);
      fetchApplicants(); // Refresh tabel setelah update
    } catch (error) {
      toast.error("Gagal mengubah status.");
    }
  };

  // Helper untuk warna Badge Status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DITERIMA": // 🔥 Sesuai Enum Database
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> DITERIMA</span>;
      case "TIDAK_DITERIMA": // 🔥 Sesuai Enum Database
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> DITOLAK</span>;
      default:
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> MENUNGGU</span>;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-[#00232C]">Memuat data pendaftar...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto">
      {/* Header Dashboard PPDB */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#0053FF]/10 rounded-xl text-[#0053FF]">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#00232C]">Manajemen PPDB</h1>
          <p className="text-[#00232C]/60 text-sm mt-1">Verifikasi dan kelola data calon siswa baru.</p>
        </div>
      </div>

      {/* Tabel Data Pendaftar (Glassmorphism Style) */}
      <div className="bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] shadow-[0_10px_30px_rgba(0,35,44,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#00232C]/10 bg-white/50 text-[#00232C] text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">No. Pendaftaran</th>
                <th className="p-4 font-semibold">Nama Calon Siswa</th>
                <th className="p-4 font-semibold">Jalur</th>
                <th className="p-4 font-semibold">Asal Sekolah</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#00232C]/80 divide-y divide-[#00232C]/5">
              {applicants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#00232C]/60">Belum ada data pendaftar.</td>
                </tr>
              ) : (
                applicants.map((app) => (
                  <tr key={app.id} className="hover:bg-white/40 transition-colors">
                    <td className="p-4 font-bold text-[#0053FF]">{app.nomor_pendaftaran}</td>
                    <td className="p-4">
                      <div className="font-semibold text-[#00232C]">{app.data_diri?.nama || "-"}</div>
                      <div className="text-xs text-[#00232C]/50">NISN: {app.data_diri?.nisn || "-"}</div>
                    </td>
                    <td className="p-4">{app.jalur}</td>
                    <td className="p-4">{app.data_diri?.asal_sekolah || "-"}</td>
                    <td className="p-4">{getStatusBadge(app.status_kelulusan)}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {/* 🔥 Ubah value onClick agar match dengan Enum */}
                        <Button 
                          onClick={() => handleUpdateStatus(app.id, "DITERIMA")}
                          disabled={app.status_kelulusan === "DITERIMA"}
                          className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg"
                        >
                          Terima
                        </Button>
                        <Button 
                          onClick={() => handleUpdateStatus(app.id, "TIDAK_DITERIMA")}
                          disabled={app.status_kelulusan === "TIDAK_DITERIMA"}
                          className="h-8 px-3 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg"
                        >
                          Tolak
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}