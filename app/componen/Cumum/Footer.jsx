"use client";

import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-800 to-blue-950 text-white py-14 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* === Kiri - Logo & Deskripsi === */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className=" h-12 rounded-xl overflow-hidden  border-blue-400 shadow-md">
              {/* Ganti src sesuai path logo kamu */}
              <img
                src="/login-register4.jpg"
                alt="Logo SMK Taruna Bhakti"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide leading-tight">
              Perpustakaan SMK<br />Taruna Bhakti
            </h2>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed">
            Menjadi pusat sumber belajar yang inspiratif, menyediakan koleksi
            buku pelajaran, novel, dan literasi umum untuk seluruh siswa SMK
            Taruna Bhakti.
          </p>
        </div>

        {/* === Tengah - Navigasi === */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b-2 border-blue-500 inline-block pb-1">
            Navigasi
          </h3>
          <ul className="space-y-2 text-blue-100">
            <li>
              <a href="#home" className="hover:text-blue-300 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#koleksi" className="hover:text-blue-300 transition">
                Koleksi Buku
              </a>
            </li>
            <li>
              <a href="#tentang" className="hover:text-blue-300 transition">
                Tentang Kami
              </a>
            </li>
            <li>
              <a href="#jadwal" className="hover:text-blue-300 transition">
                Jadwal & Kontak
              </a>
            </li>
          </ul>
        </div>

        {/* === Kanan - Sosial Media === */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b-2 border-blue-500 inline-block pb-1">
            Ikuti Kami
          </h3>
          <p className="text-blue-100 text-sm mb-4">
            Terhubung dengan kami melalui media sosial resmi sekolah:
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/smktarunabhakti"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 hover:bg-blue-600 p-3 rounded-full transition-all shadow-md"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/smktarunabhakti/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 hover:bg-blue-600 p-3 rounded-full transition-all shadow-md"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="bg-blue-700 hover:bg-blue-600 p-3 rounded-full transition-all shadow-md"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* === Garis bawah copyright === */}
      <div className="border-t border-blue-700 mt-12 pt-5 text-center text-sm text-blue-200">
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-white">
          Perpustakaan SMK Taruna Bhakti
        </span>
        . All rights reserved.
      </div>
    </footer>
  );
}
