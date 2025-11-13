"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroH() {
  return (
    <section
      id="hero"
      className="relative flex flex-col md:flex-row items-center justify-between w-full min-h-[85vh] bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white px-6 md:px-16 pt-28 md:pt-32 overflow-hidden"
    >
      {/* Elemen Background Dekoratif */}
      <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10 bg-cover bg-center"></div>

      {/* Teks Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-xl text-center md:text-left space-y-6"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Selamat Datang di{" "}
          <span className="text-yellow-300">Tarpustaka</span>
        </h1>
        <p className="text-blue-100 text-lg md:text-xl">
          Temukan ribuan koleksi buku, e-book, dan referensi digital yang
          siap memperkaya pengetahuanmu di SMK Taruna Bhakti.
        </p>

        <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
          <Link
            href="/koleksi"
            className="bg-yellow-300 text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-all"
          >
            Jelajahi Koleksi
          </Link>
          <Link
            href="/tentang"
            className="border border-yellow-300 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 hover:text-blue-900 transition-all"
          >
            Tentang Kami
          </Link>
        </div>
      </motion.div>

      {/* Gambar Hero */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 mt-12 md:mt-0"
      >
        <img
          src="/hero-books.png"
          alt="Ilustrasi Buku"
          className="w-[280px] md:w-[400px] drop-shadow-2xl"
        />
      </motion.div>
    </section>
  );
}
