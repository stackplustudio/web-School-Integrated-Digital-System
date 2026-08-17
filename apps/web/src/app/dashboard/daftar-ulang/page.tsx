"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { UserPlus, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DaftarUlangPage() {
  const [acceptedApplicants, setAcceptedApplicants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAccountInfo, setNewAccountInfo] = useState<any | null>(null);

  const fetchAccepted = async () => {
    try {
      const res = await api.get("/ppdb");
      // Hanya tampilkan pendaftar yang statusnya DITERIMA
      const filtered = res.data.filter((app: any) => app.status_kelulusan === "DITERIMA");
      setAcceptedApplicants(filtered);
    } catch (error) {
      toast.error("Gagal mengambil data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccepted();
  }, []);

  const handleGenerateAccount = async (id: string) => {
    try {
      const res = await api.post(`/ppdb/${id}/generate-account`);
      toast.success("Akun berhasil dibuat!");
      setNewAccountInfo(res.data); // Simpan kredensial untuk ditampilkan di modal/layar
      fetchAccepted(); // Refresh tabel agar tombol berubah menjadi 'Sudah Dibuat'
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membuat akun");
    }
  };

  // Fungsi copy ke clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard!");
  };

  if (isLoading) return <div className="p-8">Memuat data daftar ulang...</div>;

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-500/10 rounded-xl text-green-600">
          <UserPlus className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#00232C]">Daftar Ulang & Generate Akun</h1>
          <p className="text-[#00232C]/60 text-sm mt-1">Konversi pendaftar yang DITERIMA menjadi akun Siswa aktif.</p>
        </div>
      </div>

      {/* Jika ada akun baru di-generate, tampilkan notifikasi kredensialnya agar Admin bisa copy */}
      {newAccountInfo && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-[20px] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
            <div>
              <h3 className="font-bold text-green-800">Akun Siswa Berhasil Dibuat!</h3>
              <p className="text-sm text-green-700">NIS: <span className="font-bold">{newAccountInfo.nis}</span></p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 flex-1 w-full md:w-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
              <span className="text-xs text-gray-500">Email Login</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{newAccountInfo.email}</span>
                <button onClick={() => copyToClipboard(newAccountInfo.email)} className="text-[#0053FF] hover:bg-blue-50 p-1 rounded"><Copy className="h-4 w-4"/></button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Password Default</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-wider">{newAccountInfo.password}</span>
                <button onClick={() => copyToClipboard(newAccountInfo.password)} className="text-[#0053FF] hover:bg-blue-50 p-1 rounded"><Copy className="h-4 w-4"/></button>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => setNewAccountInfo(null)} className="h-10">Tutup</Button>
        </div>
      )}

      <div className="bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] shadow-[0_10px_30px_rgba(0,35,44,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#00232C]/10 bg-white/50 text-[#00232C] text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">No. Pendaftaran</th>
                <th className="p-4 font-semibold">Nama Siswa</th>
                <th className="p-4 font-semibold">NISN</th>
                <th className="p-4 font-semibold text-center">Status Akun</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#00232C]/80 divide-y divide-[#00232C]/5">
              {acceptedApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#00232C]/60">Belum ada siswa yang dinyatakan DITERIMA.</td>
                </tr>
              ) : (
                acceptedApplicants.map((app) => {
                  const isAccountGenerated = !!app.student; // Mengecek apakah relasi student sudah ada (tidak null)
                  return (
                    <tr key={app.id} className="hover:bg-white/40 transition-colors">
                      <td className="p-4 font-bold text-[#0053FF]">{app.nomor_pendaftaran}</td>
                      <td className="p-4 font-semibold text-[#00232C]">{app.data_diri?.nama || "-"}</td>
                      <td className="p-4">{app.data_diri?.nisn || "-"}</td>
                      <td className="p-4 text-center">
                        {isAccountGenerated 
                          ? <span className="text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-md text-xs">SUDAH AKTIF</span> 
                          : <span className="text-amber-600 font-semibold bg-amber-100 px-2 py-1 rounded-md text-xs">MENUNGGU KONVERSI</span>
                        }
                      </td>
                      <td className="p-4 flex justify-center">
                        <Button 
                          onClick={() => handleGenerateAccount(app.id)}
                          disabled={isAccountGenerated}
                          className={`h-9 px-4 text-xs text-white rounded-lg transition-all ${
                            isAccountGenerated ? "bg-gray-400 cursor-not-allowed" : "bg-[#0053FF] hover:bg-[#0047D9]"
                          }`}
                        >
                          {isAccountGenerated ? "Akun Selesai" : "Generate Akun Siswa"}
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}