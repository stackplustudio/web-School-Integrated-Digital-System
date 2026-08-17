"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { BookOpen, FileText, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LmsPortalPage() {
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [selectedClassMapel, setSelectedClassMapel] = useState<string>("");
  
  const [materials, setMaterials] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [matForm, setMatForm] = useState({ judul: "", file_url: "" });
  const [taskForm, setTaskForm] = useState({ judul: "", deskripsi: "", tenggat_waktu: "" });

  useEffect(() => {
    fetchMyClasses();
  }, []);

  const fetchMyClasses = async () => {
    try {
      const res = await api.get("/lms/classes");
      setMyClasses(res.data);
      if (res.data.length > 0) {
        setSelectedClassMapel(res.data[0].id); // Pilih otomatis yang pertama
      }
    } catch (error) {
      toast.error("Gagal memuat daftar kelas.");
    } finally {
      setIsLoading(false);
    }
  };

  // Muat ulang materi & tugas saat dropdown kelas/mapel berubah
  useEffect(() => {
    if (!selectedClassMapel) return;
    const [classId, subjectId] = selectedClassMapel.split("-");
    fetchLmsData(classId, subjectId);
  }, [selectedClassMapel]);

  const fetchLmsData = async (classId: string, subjectId: string) => {
    try {
      const [matRes, taskRes] = await Promise.all([
        api.get(`/lms/materials?classId=${classId}&subjectId=${subjectId}`),
        api.get(`/lms/assignments?classId=${classId}&subjectId=${subjectId}`)
      ]);
      setMaterials(matRes.data);
      setAssignments(taskRes.data);
    } catch (error) {
      toast.error("Gagal memuat data LMS.");
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    const [classId, subjectId] = selectedClassMapel.split("-");
    try {
      await api.post("/lms/materials", { ...matForm, classId, subjectId });
      toast.success("Materi berhasil diunggah!");
      setMatForm({ judul: "", file_url: "" });
      fetchLmsData(classId, subjectId);
    } catch (error) {
      toast.error("Gagal menambah materi");
    }
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const [classId, subjectId] = selectedClassMapel.split("-");
    try {
      await api.post("/lms/assignments", { ...taskForm, classId, subjectId });
      toast.success("Tugas berhasil dibuat!");
      setTaskForm({ judul: "", deskripsi: "", tenggat_waktu: "" });
      fetchLmsData(classId, subjectId);
    } catch (error) {
      toast.error("Gagal membuat tugas");
    }
  };

  if (isLoading) return <div className="p-8">Memuat Ruang Kelas...</div>;

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] p-6 shadow-[0_10px_30px_rgba(0,35,44,0.08)]">
        <div>
          <h1 className="text-2xl font-bold text-[#00232C]">Portal Guru (LMS)</h1>
          <p className="text-[#00232C]/60 text-sm mt-1">Kelola materi belajar dan penugasan untuk siswa.</p>
        </div>
        
        <div className="w-full md:w-auto">
          <label className="text-xs font-semibold text-[#00232C]/60 mb-1 block">Ruang Kelas Aktif</label>
          <select 
            className="flex h-10 w-full md:w-80 rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={selectedClassMapel}
            onChange={(e) => setSelectedClassMapel(e.target.value)}
          >
            {myClasses.length === 0 && <option value="">-- Belum ada jadwal kelas --</option>}
            {myClasses.map(mc => (
              <option key={mc.id} value={mc.id}>{mc.className} - {mc.subjectName}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedClassMapel ? (
        <div className="text-center p-12 bg-white/40 rounded-xl border border-white">
          <p className="text-gray-500">Anda belum memiliki jadwal mengajar yang terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* KOLOM MATERI */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] p-6 shadow-sm">
              <h3 className="font-bold text-[#00232C] mb-4 flex items-center gap-2"><Upload className="h-4 w-4" /> Unggah Materi</h3>
              <form onSubmit={handleAddMaterial} className="space-y-3">
                <Input required placeholder="Judul Materi (Cth: Bab 1 - Aljabar)" value={matForm.judul} onChange={e => setMatForm({...matForm, judul: e.target.value})} />
                <Input placeholder="URL File / GDrive Link (Opsional)" value={matForm.file_url} onChange={e => setMatForm({...matForm, file_url: e.target.value})} />
                <Button type="submit" className="w-full bg-[#0053FF] hover:bg-[#0047D9] text-white">Simpan Materi</Button>
              </form>
            </div>

            <div className="bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] p-6 shadow-sm">
              <h3 className="font-bold text-[#00232C] mb-4 flex items-center gap-2"><BookOpen className="h-4 w-4" /> Daftar Materi</h3>
              {materials.length === 0 ? <p className="text-sm text-gray-500">Belum ada materi.</p> : (
                <ul className="space-y-3">
                  {materials.map(m => (
                    <li key={m.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <p className="font-semibold text-sm">{m.judul}</p>
                      {m.file_url && <a href={m.file_url} target="_blank" className="text-xs text-blue-600 hover:underline">Lihat Lampiran</a>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* KOLOM TUGAS */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] p-6 shadow-sm">
              <h3 className="font-bold text-[#00232C] mb-4 flex items-center gap-2"><Plus className="h-4 w-4" /> Buat Tugas Baru</h3>
              <form onSubmit={handleAddAssignment} className="space-y-3">
                <Input required placeholder="Judul Tugas" value={taskForm.judul} onChange={e => setTaskForm({...taskForm, judul: e.target.value})} />
                <textarea required placeholder="Deskripsi atau instruksi tugas..." className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={taskForm.deskripsi} onChange={e => setTaskForm({...taskForm, deskripsi: e.target.value})} />
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Tenggat Waktu (Deadline)</label>
                  <Input type="datetime-local" required value={taskForm.tenggat_waktu} onChange={e => setTaskForm({...taskForm, tenggat_waktu: e.target.value})} />
                </div>
                <Button type="submit" className="w-full bg-[#0053FF] hover:bg-[#0047D9] text-white">Publikasikan Tugas</Button>
              </form>
            </div>

            <div className="bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] p-6 shadow-sm">
              <h3 className="font-bold text-[#00232C] mb-4 flex items-center gap-2"><FileText className="h-4 w-4" /> Daftar Tugas</h3>
              {assignments.length === 0 ? <p className="text-sm text-gray-500">Belum ada tugas.</p> : (
                <ul className="space-y-3">
                  {assignments.map(a => (
                    <li key={a.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <p className="font-semibold text-sm text-[#00232C]">{a.judul}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{a.deskripsi}</p>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded">DL: {new Date(a.tenggat_waktu).toLocaleDateString()}</span>
                        <span>{a._count.submissions} Siswa Mengumpulkan</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}