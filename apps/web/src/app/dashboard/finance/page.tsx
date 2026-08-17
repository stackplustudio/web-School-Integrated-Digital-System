"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Wallet, Receipt, CreditCard, Plus, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FinancePage() {
  const [role, setRole] = useState<string>("SISWA");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [billingTypes, setBillingTypes] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [newBillingType, setNewBillingType] = useState({ nama: "", nominal_default: "" });
  const [newInvoice, setNewInvoice] = useState({ studentId: "", billingTypeId: "", periode: "", nominal: "", jatuh_tempo: "" });
  const [payData, setPayData] = useState({ invoiceId: "", jumlah: "", metode: "Transfer Bank" });

  useEffect(() => {
    const user = localStorage.getItem("user");
    let currentUserRole = "SISWA";
    let studentId = "";

    if (user) {
      const parsedUser = JSON.parse(user);
      currentUserRole = parsedUser.role;
      setRole(currentUserRole);
      // Asumsikan untuk siswa, ID user = ID student (bisa disesuaikan dengan logika Auth Anda)
      if (currentUserRole === "SISWA") studentId = parsedUser.id; 
    }
    
    fetchData(currentUserRole, studentId);
  }, []);

  const fetchData = async (userRole: string, studentId: string) => {
    try {
      // Jika Admin/Guru, ambil semua tagihan. Jika Siswa, ambil tagihannya saja (sementara tanpa filter ID untuk demo)
      const invRes = await api.get("/finance/invoices");
      setInvoices(invRes.data);

      if (userRole !== "SISWA") {
        const typeRes = await api.get("/finance/billing-types");
        setBillingTypes(typeRes.data);
        
        const stdRes = await api.get("/students");
        setStudents(stdRes.data);
      }
    } catch (error) {
      toast.error("Gagal memuat data keuangan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBillingType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/finance/billing-types", newBillingType);
      toast.success("Jenis tagihan ditambahkan!");
      setNewBillingType({ nama: "", nominal_default: "" });
      fetchData(role, "");
    } catch (error) {
      toast.error("Gagal menambahkan jenis tagihan.");
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/finance/invoices", newInvoice);
      toast.success("Tagihan berhasil dibuat!");
      setNewInvoice({ studentId: "", billingTypeId: "", periode: "", nominal: "", jatuh_tempo: "" });
      fetchData(role, "");
    } catch (error) {
      toast.error("Gagal membuat tagihan.");
    }
  };

  const handlePayInvoice = async (invoiceId: string, nominal: number) => {
    try {
      await api.post(`/finance/invoices/${invoiceId}/pay`, {
        jumlah: nominal,
        metode: "Transfer Bank Sistem",
        bukti_url: "otomatis-sistem"
      });
      toast.success("Pembayaran berhasil dikonfirmasi!");
      fetchData(role, "");
    } catch (error) {
      toast.error("Gagal melakukan pembayaran.");
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  if (isLoading) return <div className="p-8">Memuat Data Keuangan...</div>;

  return (
    <div className="p-6 md:p-8 max-w-[1280px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] p-6 shadow-[0_10px_30px_rgba(0,35,44,0.08)]">
        <div className="p-3 bg-[#0053FF]/10 rounded-xl text-[#0053FF]">
          <Wallet className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#00232C]">Keuangan & SPP</h1>
          <p className="text-[#00232C]/60 text-sm mt-1">
            {role === "SISWA" ? "Lihat dan lunasi tagihan administrasi sekolah Anda." : "Kelola jenis tagihan, terbitkan invoice, dan pantau pembayaran."}
          </p>
        </div>
      </div>

      {role !== "SISWA" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tambah Jenis Tagihan */}
          <div className="bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] p-6 shadow-sm">
            <h3 className="font-bold text-[#00232C] mb-4 flex items-center gap-2"><Plus className="w-4 h-4"/> Buat Jenis Tagihan</h3>
            <form onSubmit={handleCreateBillingType} className="space-y-3">
              <Input required placeholder="Nama (Cth: SPP Kelas 10)" value={newBillingType.nama} onChange={e => setNewBillingType({...newBillingType, nama: e.target.value})} />
              <Input required type="number" placeholder="Nominal Default (Cth: 500000)" value={newBillingType.nominal_default} onChange={e => setNewBillingType({...newBillingType, nominal_default: e.target.value})} />
              <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white">Simpan Jenis Tagihan</Button>
            </form>
          </div>

          {/* Terbitkan Tagihan Baru */}
          <div className="lg:col-span-2 bg-blue-50/50 backdrop-blur-[20px] border border-blue-100 rounded-[20px] p-6 shadow-sm">
            <h3 className="font-bold text-[#0053FF] mb-4 flex items-center gap-2"><Receipt className="w-4 h-4"/> Terbitkan Tagihan Baru</h3>
            <form onSubmit={handleCreateInvoice} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select required className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm" value={newInvoice.studentId} onChange={(e) => setNewInvoice({...newInvoice, studentId: e.target.value})}>
                <option value="">-- Pilih Siswa --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.nama} ({s.nis})</option>)}
              </select>
              
              <select required className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm" value={newInvoice.billingTypeId} onChange={(e) => {
                const selected = billingTypes.find(b => b.id === e.target.value);
                setNewInvoice({...newInvoice, billingTypeId: e.target.value, nominal: selected ? selected.nominal_default.toString() : ""});
              }}>
                <option value="">-- Pilih Jenis Tagihan --</option>
                {billingTypes.map(b => <option key={b.id} value={b.id}>{b.nama}</option>)}
              </select>

              <Input required placeholder="Periode (Cth: Agustus 2026)" value={newInvoice.periode} onChange={e => setNewInvoice({...newInvoice, periode: e.target.value})} />
              <Input required type="number" placeholder="Nominal Tagihan" value={newInvoice.nominal} onChange={e => setNewInvoice({...newInvoice, nominal: e.target.value})} />
              <Input required type="date" placeholder="Jatuh Tempo" value={newInvoice.jatuh_tempo} onChange={e => setNewInvoice({...newInvoice, jatuh_tempo: e.target.value})} />
              
              <Button type="submit" className="w-full bg-[#0053FF] hover:bg-[#0047D9] text-white">Terbitkan Tagihan</Button>
            </form>
          </div>
        </div>
      )}

      {/* Tabel Tagihan */}
      <div className="bg-white/70 backdrop-blur-[20px] border border-white/60 rounded-[20px] p-6 shadow-[0_10px_30px_rgba(0,35,44,0.08)]">
        <h3 className="font-bold text-[#00232C] mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5"/> Daftar Tagihan</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                {role !== "SISWA" && <th className="p-4 font-semibold">Nama Siswa</th>}
                <th className="p-4 font-semibold">Jenis Tagihan</th>
                <th className="p-4 font-semibold">Periode</th>
                <th className="p-4 font-semibold">Nominal</th>
                <th className="p-4 font-semibold">Jatuh Tempo</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {invoices.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Belum ada tagihan yang diterbitkan.</td></tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50">
                    {role !== "SISWA" && (
                      <td className="p-4 font-bold text-[#00232C]">{inv.student?.nama}</td>
                    )}
                    <td className="p-4 font-medium">{inv.billingType?.nama}</td>
                    <td className="p-4 text-gray-600">{inv.periode}</td>
                    <td className="p-4 font-bold text-[#0053FF]">{formatRupiah(inv.nominal)}</td>
                    <td className="p-4 text-red-500 text-xs font-semibold">{new Date(inv.jatuh_tempo).toLocaleDateString('id-ID')}</td>
                    <td className="p-4">
                      {inv.status === "LUNAS" 
                        ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> LUNAS</span>
                        : <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> BELUM BAYAR</span>
                      }
                    </td>
                    <td className="p-4 text-right">
                      {inv.status === "BELUM_BAYAR" ? (
                        <Button 
                          onClick={() => handlePayInvoice(inv.id, inv.nominal)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                        >
                          {role === "SISWA" ? "Bayar Sekarang" : "Konfirmasi Lunas"}
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Selesai</span>
                      )}
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