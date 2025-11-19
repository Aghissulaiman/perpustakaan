"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex flex-col md:flex-row items-center justify-between w-full h-screen bg-white text-gray-800 px-6 md:px-16 pt-24 md:pt-32 overflow-hidden"
    >
      {/* Background accent (biru lembut) */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white"></div>

      {/* Konten teks */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex-1 text-center md:text-left"
      >
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3 -mt-20">
          Selamat Datang di{" "}
          <span className="text-blue-600">Perpustakaan TB</span>
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto md:mx-0 mb-8">
          Jelajahi dunia pengetahuan, temukan inspirasi, dan perluas wawasanmu
          bersama kami di Perpustakaan SMK Taruna Bhakti.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-500 transition-all shadow-md"
          >
            Lihat Koleksi
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all"
          >
            Daftar Sekarang
          </Link>
        </div>
      </motion.div>

      {/* Gambar hero */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex-1 flex justify-center md:justify-end mt-10 md:mt-0"
      >
        <div className="relative w-[75%] max-w-md md:max-w-lg">
          <img
            src="/Hero1.png"
            alt="Ilustrasi Buku"
            className="w-full h-auto drop-shadow-xl rounded-2xl -mt-25"
          />
          <div className="absolute -z-10 top-6 left-6 w-full h-full rounded-2xl bg-blue-200/30 blur-3xl"></div>
        </div>
      </motion.div>

      {/* Wave bawah */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-20 fill-blue-50"
        >
          <path d="M0,0V46.29c47.79,22,103.59,29,158,17.39C288.51,41.3,400.64-2.45,515,2.72c110.46,4.94,219.52,54.55,329,70.24C966.93,90.55,1080,65,1200,25.36V0Z" />
        </svg>
      </div>
    </section>
  );
}
