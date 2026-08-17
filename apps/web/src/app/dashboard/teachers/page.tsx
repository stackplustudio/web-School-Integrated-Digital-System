"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Briefcase, Plus, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MasterDataGuruPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAccount, setNewAccount] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "" });

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers");
      setTeachers(res.data);
    } catch (error) {
      toast.error("Gagal mengambil data guru.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNewAccount(null);

    try {
      const res = await api.post("/teachers", formData);
      toast.success("Akun Guru berhasil dibuat!");
      setNewAccount(res.data);
      setFormData({ name: "", email: "" }); // Reset form
      fetchTeachers(); // Refresh tabel
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menambahkan guru");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin!");
  };

  if (isLoading) return <div className="p-8">Memuat Master Data Guru...</div>;

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600">
          <Briefcase className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#00232C]">Master Data Guru</h1>
          <p className="text-[#00232C]/60 text-sm mt-1">Kelola data tenaga pendidik dan akun login mereka.</p>
        </div>
      </div>

      {/* Area Notifikasi Akun Baru */}
      {newAccount && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-[20px] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-bold text-green-800">Akun Berhasil Dibuat</h3>
              <p className="text-sm text-green-700">Berikan kredensial ini kepada guru yang bersangkutan.</p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-green-100 flex gap-4 text-sm">
            <div><span className="text-gray-500 text-xs block">Email</span><span className="font-semibold">{newAccount.user.email}</span></div>
            <div><span className="text-gray-500 text-xs block">Password</span><span className="font-semibold">{newAccount.defaultPassword}</span></div>
            <button onClick={() => copyToClipboard(`Email: ${newAccount.user.email} | Password: ${newAccount.defaultPassword}`)} className="text-[#0053FF] hover:bg-blue-50 p-2 rounded"><Copy className="h-4 w-4"/></button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah Guru */}
        <div className="lg:col-span-1 bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] p-6 shadow-[0_10px_30px_rgba(0,35,44,0.08)] h-fit">
          <h3 className="font-bold text-[#00232C] mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Tambah Guru Baru
          </h3>
          <form onSubmit={handleAddTeacher} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#00232C]/60 mb-1 block">Nama Lengkap & Gelar</label>
              <Input required placeholder="Misal: Budi Cahyono, S.Kom" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#00232C]/60 mb-1 block">Email Akun</label>
              <Input required type="email" placeholder="budi@guru.stackplustudio.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#0053FF] hover:bg-[#0047D9] text-white">
              {isSubmitting ? "Memproses..." : "Buat Akun Guru"}
            </Button>
          </form>
        </div>

        {/* Tabel Data Guru */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] shadow-[0_10px_30px_rgba(0,35,44,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#00232C]/10 bg-white/50 text-[#00232C] text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Nama Guru</th>
                  <th className="p-4 font-semibold">Email Login</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#00232C]/80 divide-y divide-[#00232C]/5">
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-[#00232C]/60">Belum ada data guru.</td>
                  </tr>
                ) : (
                  teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-white/40 transition-colors">
                      <td className="p-4 font-semibold text-[#00232C]">{teacher.name}</td>
                      <td className="p-4 text-gray-500">{teacher.email}</td>
                      <td className="p-4 text-center">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs font-bold">AKTIF</span>
                      </td>
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