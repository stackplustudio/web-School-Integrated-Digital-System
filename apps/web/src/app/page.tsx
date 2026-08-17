import { redirect } from "next/navigation";

export default function Home() {
  // Langsung lempar siapapun yang mengakses rute utama ( / ) ke halaman login baru
  redirect("/auth/login");
}