"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const [role, setRoleed] = useState("siswa");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        alert("Register berhasil!");
        window.location.href = "/login"; // redirect di client
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat register.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" 
      style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMAzeSsbIXGAVZl0aleWr7CPls5neEpV2tHg&s')" }}>
      
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 flex rounded-2xl overflow-hidden backdrop-blur-lg border border-white/20 bg-white/10 shadow-2xl w-[900px] h-[550px] text-white">
        
        <div className="w-[35%] bg-blue-900/40 flex flex-col items-center justify-center p-6 border-r border-white/20">
          <Image src="/login-register4.jpg" alt="Register Illustration" width={180} height={180} className="mb-4" />
          <p className="text-center text-blue-100 text-sm">
            Buat akunmu dan nikmati akses ke koleksi buku digital!
          </p>
        </div>

        <div className="w-[65%] px-10 py-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Daftar Akun</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-blue-100">Nama</label>
                <input type="text" name="username" placeholder="Masukkan nama" required
                  className="w-full p-2.5 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              </div>
              <div>
                <label className="text-sm text-blue-100">Email</label>
                <input type="email" name="email" placeholder="Masukkan email" required
                  className="w-full p-2.5 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-blue-100">Password</label>
                <input type="password" name="password" placeholder="Masukkan password" required
                  className="w-full p-2.5 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
              </div>
              <div>
                <label className="text-sm text-blue-100">Pilih Role</label>
                <select name="role" value={role} onChange={(e)=>setRole(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="siswa" className="text-black">Siswa</option>
                  <option value="guru" className="text-black">Guru</option>
                </select>
              </div>
            </div>

            {role === "siswa" ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-blue-100">NIS</label>
                  <input type="text" name="nis" placeholder="Nomor Induk Siswa" required
                    className="w-full p-2.5 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                </div>
                <div>
                  <label className="text-sm text-blue-100">Kelas</label>
                  <input type="text" name="kelas" placeholder="Contoh: X PPLG 5" required
                    className="w-full p-2.5 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-blue-100">NIP</label>
                  <input type="text" name="nip" placeholder="Nomor Induk Guru" required
                    className="w-full p-2.5 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                </div>
                <div>
                  <label className="text-sm text-blue-100">Mapel</label>
                  <input type="text" name="mapel" placeholder="Contoh: PBO" required
                    className="w-full p-2.5 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                Daftar
              </button>
            </div>
          </form>

          <p className="text-sm text-blue-100 mt-6 text-center">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-300 hover:underline">
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
