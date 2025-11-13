"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        // Simpan data user ke localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        alert(`Selamat datang, ${data.user.username}!`);

        // Redirect berdasarkan role
        if (data.user.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/home";
        }
      } else {
        alert(data.error || "Email atau password salah!");
      }
    } catch (err) {
      console.error("Error saat login:", err);
      alert("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage:
          "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMAzeSsbIXGAVZl0aleWr7CPls5neEpV2tHg&s')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 flex rounded-2xl overflow-hidden backdrop-blur-lg border border-white/20 bg-white/10 shadow-2xl w-[850px] h-[500px] text-white">
        {/* Kiri (gambar ilustrasi) */}
        <div className="w-[35%] bg-blue-900/40 flex flex-col items-center justify-center p-6 border-r border-white/20">
          <Image
            src="/login-register4.jpg"
            alt="Login Illustration"
            width={180}
            height={180}
            className="mb-4"
          />
          <p className="text-center text-blue-100 text-sm">
            Masuk dan lanjutkan petualangan membacamu
          </p>
        </div>

        {/* Kanan (form login) */}
        <div className="w-[65%] px-10 py-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Masuk Akun</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-blue-100">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Masukkan email"
                className="w-full p-2.5 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="text-sm text-blue-100">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Masukkan password"
                className="w-full p-2.5 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm mt-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="accent-blue-500 rounded" />
                <span className="text-blue-100">Ingat saya</span>
              </label>
              <Link href="#" className="text-blue-300 hover:underline">
                Lupa password?
              </Link>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Loading..." : "Masuk"}
              </button>
            </div>
          </form>

          <p className="text-sm text-blue-100 mt-6 text-center">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-300 hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
