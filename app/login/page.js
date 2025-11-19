"use client";


import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";   // ✅ tambahkan ini
import Link from "next/link";     // ✅ tambahkan ini

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("Email atau password salah!");
      setLoading(false);
      return;
    }

    // Ambil session menggunakan getSession
    const session = await getSession();
    const role = session?.user?.role;

    // Redirect sesuai role
    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "guru") {
      router.push("/guru/dashboard");
    } else {
      router.push("/home");
    }

    setLoading(false);
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

            <div className="flex justify-end mt-6">
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
