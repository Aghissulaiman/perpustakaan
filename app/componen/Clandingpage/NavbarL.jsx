"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] z-50 rounded-3xl border backdrop-blur-xl transition-all duration-500 ${
        scrolled
          ? "bg-gradient-to-r from-white/95 to-blue-50/90 border-blue-200/50 shadow-xl shadow-blue-100/50"
          : "bg-gradient-to-r from-white/80 to-blue-50/70 border-gray-200/50 shadow-lg shadow-gray-100/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/login-register4.jpg"
            alt="Logo SMK Taruna Bhakti"
            className="w-9 h-9 rounded-full border border-blue-200 shadow-sm"
          />
          <span className="text-lg font-semibold tracking-wide bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Perpustakaan <span className="font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">TB</span>
          </span>
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-700">
          <Link
            href="#koleksi"
            className="relative hover:text-blue-600 transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-blue-500 before:to-blue-600 before:transition-all before:duration-300 hover:before:w-full"
          >
            Koleksi Buku
          </Link>



          {/* Tombol Login & Daftar */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2 rounded-full border-2 border-blue-500 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 rounded-full font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-600 hover:to-blue-600 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Daftar
            </Link>
          </div>
        </div>

        {/* Tombol Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-500 hover:shadow-lg hover:scale-110 transition-all duration-300"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden mx-4 mb-3 p-6 rounded-3xl bg-gradient-to-br from-white/95 to-blue-50/90 border border-blue-200/50 shadow-xl backdrop-blur-xl transition-all duration-500 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-5 font-medium text-gray-800 text-sm">
            <Link href="#koleksi" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition-colors duration-300">
              Koleksi Buku
            </Link>
            <Link href="#tentang" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition-colors duration-300">
              Tentang Kami
            </Link>
            <Link href="#kontak" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition-colors duration-300">
              Kontak
            </Link>

            <div className="flex flex-col gap-4 pt-5 border-t border-blue-200/50">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="px-5 py-3 rounded-full text-center border-2 border-blue-500 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="px-5 py-3 rounded-full text-center font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-purple-600 hover:to-blue-600 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
