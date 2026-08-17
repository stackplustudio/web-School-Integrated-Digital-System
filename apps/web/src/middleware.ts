import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil token dari cookie
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/'; // Asumsi '/' adalah halaman Login SIDS
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // Proteksi rute SIDS: Jika belum login tapi mencoba buka modul dashboard
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Jika sudah login tapi iseng buka halaman login -> Paksa masuk ke dashboard
  if (isAuthPage && token) {
    // Nanti di dalam komponen /dashboard, frontend akan memilah tampilan 
    // berdasarkan Role (Kepsek, Guru, Siswa) dari token payload
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Target file mana saja yang mau diawasi middleware ini
export const config = {
  matcher: ['/', '/dashboard/:path*'],
};