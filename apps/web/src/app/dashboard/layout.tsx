import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Warna background #F4F7FE ini penting agar menyatu sempurna dengan efek "cutout" Sidebar
    <div className="flex min-h-screen bg-[#F4F7FE]">
      {/* Sidebar tetap di kiri */}
      <Sidebar />
      
      {/* Area konten dinamis di kanan */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="min-h-screen p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}