"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, LogOut, Settings, User, BookOpen } from "lucide-react";

export default function NavbarS() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    alert("Kamu telah logout!");
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] z-50 rounded-2xl border backdrop-blur-lg transition-all duration-300 ${
        scrolled
          ? "bg-white/90 border-blue-100 shadow-md"
          : "bg-white/70 border-gray-100 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Bagian kiri: Logo + Menu */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-3">
            <img
              src="/login-register4.jpg"
              alt="Logo SMK Taruna Bhakti"
              className="h-9 border-blue-200 shadow-sm"
            />
            <span className="text-lg font-semibold tracking-wide text-blue-700">
              Tarpustaka
            </span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-6 font-medium text-black">
            <Link
              href="/home"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              Beranda
            </Link>
            <Link
              href="/koleksi"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              Koleksi
            </Link>
          </div>
        </div>

        {/* Bagian kanan: Profil */}
        <div className="hidden md:flex items-center">
          {/* Profil Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full border border-blue-300 bg-blue-100 flex items-center justify-center overflow-hidden shadow-sm hover:ring-2 hover:ring-blue-300 transition-all"
            >
              <img
                src="/profile.jpg"
                alt="Profil"
                className="w-full h-full object-cover rounded-full"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-blue-100 rounded-xl shadow-lg py-2 text-sm text-gray-700 animate-fadeIn">
                <Link
                  href="/home/profile"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User size={16} /> Profil Saya
                </Link>
                <Link
                  href="/home/history"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  <BookOpen size={16} /> History Peminjaman
                </Link>
                <Link
                  href="/pengaturan"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings size={16} /> Pengaturan
                </Link>
                <Link
                  href="/"
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={16} /> Logout
                </Link>
              </div>
            )}
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
            <Link href="/home" onClick={() => setIsOpen(false)}>
              Beranda
            </Link>
            <Link href="/koleksi" onClick={() => setIsOpen(false)}>
              Koleksi
            </Link>
            <Link href="/home/profil" onClick={() => setIsOpen(false)}>
              Profil
            </Link>
            <Link href="/history" onClick={() => setIsOpen(false)}>
              History Peminjaman
            </Link>

            <div className="flex flex-col gap-3 pt-4 border-t border-blue-100">
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="px-4 py-2 rounded-full text-center border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 flex justify-center items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
