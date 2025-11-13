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
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] z-50 rounded-2xl border backdrop-blur-lg transition-all duration-300 ${
        scrolled
          ? "bg-white/90 border-blue-100 shadow-md"
          : "bg-white/70 border-gray-100 shadow-sm"
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
          <span className="text-lg font-semibold tracking-wide text-blue-700">
            Perpustakaan <span className="font-bold">TB</span>
          </span>
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-700">
          <Link
            href="#koleksi"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            Koleksi Buku
          </Link>
          <Link
            href="#tentang"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            Tentang Kami
          </Link>
          <Link
            href="#kontak"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            Kontak
          </Link>

          {/* Tombol Login & Daftar */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 rounded-full font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all duration-300"
            >
              Daftar
            </Link>
          </div>
        </div>

        {/* Tombol Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-blue-700 transition duration-300"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden mx-4 mb-3 p-5 rounded-2xl bg-white/90 border border-blue-100 shadow-md backdrop-blur-md transition-all duration-300">
          <div className="flex flex-col space-y-4 font-medium text-gray-800 text-sm">
            <Link href="#koleksi" onClick={() => setIsOpen(false)}>
              Koleksi Buku
            </Link>
            <Link href="#tentang" onClick={() => setIsOpen(false)}>
              Tentang Kami
            </Link>
            <Link href="#kontak" onClick={() => setIsOpen(false)}>
              Kontak
            </Link>

            <div className="flex flex-col gap-3 pt-4 border-t border-blue-100">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-full text-center border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-full text-center font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all duration-300"
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
