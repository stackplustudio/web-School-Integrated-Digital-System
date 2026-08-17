"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { FileText, CheckCircle, XCircle, Clock, Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LeaveRequestsPage() {
  const [role, setRole] = useState<string>("SISWA");
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State (Khusus Siswa)
  const [students, setStudents] = useState<any[]>([]); // Untuk simulasi pilih nama siswa
  const [formData, setFormData] = useState({ studentId: "", tanggal: "", jenis: "SAKIT", lampiran: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setRole(JSON.parse(user).role);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Ambil daftar pengajuan
      const res = await api.get("/leave-requests");
      setRequests(res.data);

      // Jika siswa, ambil daftar siswa untuk dropdown (simulasi karena belum ada auth spesifik siswa di frontend)
      const resStudents = await api.get("/students"); // Pastikan rute ini ada di controller students Anda
      setStudents(resStudents.data);
      if (resStudents.data.length > 0) {
        setFormData(prev => ({ ...prev, studentId: resStudents.data[0].id }));
      }
    } catch (error) {
      toast.error("Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/leave-requests", formData);
      toast.success("Pengajuan berhasil dikirim!");
      setFormData({ ...formData, tanggal: "", lampiran: "" });
      fetchData(); // Refresh data
    } catch (error) {
      toast.error("Gagal mengirim pengajuan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (id: string, status: string) => {
    try {
      await api.put(`/leave-requests/${id}/status`, { status });
      toast.success(`Pengajuan ${status.toLowerCase()}!`);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error("Gagal memperbarui status.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "MENUNGGU": return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> Menunggu</span>;
      case "DISETUJUI": return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> Disetujui</span>;
      case "DITOLAK": return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> Ditolak</span>;
      default: return null;
    }
  };

  if (isLoading) return <div className="p-8">Memuat Data...</div>;

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-6">
      
      <div className="flex items-center gap-3 bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] p-6 shadow-[0_10px_30px_rgba(0,35,44,0.08)]">
        <div className="p-3 bg-[#0053FF]/10 rounded-xl text-[#0053FF]">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#00232C]">Perizinan & Cuti</h1>
          <p className="text-[#00232C]/60 text-sm mt-1">
            {role === "SISWA" ? "Ajukan surat sakit atau izin tidak masuk sekolah di sini." : "Kelola persetujuan pengajuan izin dan sakit siswa."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Form Pengajuan (Tampil Jika Siswa) */}
        {role === "SISWA" && (
          <div className="lg:col-span-1 bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] p-6 shadow-[0_10px_30px_rgba(0,35,44,0.08)] h-fit">
            <h3 className="font-bold text-[#00232C] mb-4">Buat Pengajuan Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Pilih Nama Anda</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                >
                  {students.map(s => <option key={s.id} value={s.id}>{s.nama} ({s.nis})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Jenis Pengajuan</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.jenis} onChange={(e) => setFormData({...formData, jenis: e.target.value})}
                >
                  <option value="SAKIT">Sakit (Butuh Surat Dokter)</option>
                  <option value="IZIN">Izin (Keperluan Keluarga)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Tanggal Izin</label>
                <Input type="date" required value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Tautan Lampiran (Gdrive / Gambar)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"><Upload className="w-4 h-4" /></span>
                  <Input type="url" placeholder="https://..." required className="rounded-l-none" value={formData.lampiran} onChange={(e) => setFormData({...formData, lampiran: e.target.value})} />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#0053FF] hover:bg-[#0047D9] text-white gap-2 mt-4">
                <Send className="w-4 h-4" /> {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
              </Button>
            </form>
          </div>
        )}

        {/* Kolom Kanan: Tabel Riwayat / Persetujuan */}
        <div className={`bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] p-6 shadow-[0_10px_30px_rgba(0,35,44,0.08)] ${role === "SISWA" ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <h3 className="font-bold text-[#00232C] mb-4">
            {role === "SISWA" ? "Riwayat Pengajuan Anda" : "Daftar Tunggu Persetujuan"}
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Tanggal</th>
                  {role !== "SISWA" && <th className="p-4 font-semibold">Nama Siswa</th>}
                  <th className="p-4 font-semibold">Jenis</th>
                  <th className="p-4 font-semibold">Lampiran</th>
                  <th className="p-4 font-semibold">Status</th>
                  {role !== "SISWA" && <th className="p-4 font-semibold text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {requests.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada data pengajuan.</td></tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-medium text-gray-700">{new Date(req.tanggal).toLocaleDateString('id-ID')}</td>
                      
                      {role !== "SISWA" && (
                        <td className="p-4">
                          <p className="font-bold text-[#00232C]">{req.student?.nama}</p>
                          <p className="text-xs text-gray-500">NIS: {req.student?.nis}</p>
                        </td>
                      )}
                      
                      <td className="p-4">
                        <span className="font-bold text-gray-600">{req.jenis}</span>
                      </td>
                      <td className="p-4">
                        <a href={req.lampiran} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs font-medium">Lihat Dokumen</a>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(req.status_approval)}
                      </td>
                      
                      {role !== "SISWA" && (
                        <td className="p-4 text-right">
                          {req.status_approval === "MENUNGGU" ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleAction(req.id, 'DISETUJUI')} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors" title="Setujui"><CheckCircle className="w-5 h-5"/></button>
                              <button onClick={() => handleAction(req.id, 'DITOLAK')} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors" title="Tolak"><XCircle className="w-5 h-5"/></button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Selesai</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}