"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, BookOpen, CalendarCheck } from "lucide-react";

export default function NavbarAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const userJson = localStorage.getItem("user");
    if (userJson) setUser(JSON.parse(userJson));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!user || user.role !== "admin") return null; // hanya admin yang bisa lihat navbar ini

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
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <img
            src="/login-register4.jpg"
            alt="Logo Admin"
            className="w-9 h-9 "
          />
          <span className="text-lg font-semibold tracking-wide text-blue-700">
            Admin <span className="font-bold">TB</span>
          </span>
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-700">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-300"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            href="/admin/dashboard/datapeminjam"
            className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-300"
          >
            <CalendarCheck size={18} /> Peminjam
          </Link>
          <Link
            href="/admin/dashboard/databuku"
            className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-300"
          >
            <BookOpen size={18} /> Buku
          </Link>

          {/* Tombol Logout */}
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="ml-4 px-4 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-300"
          >
            Logout
          </button>
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
            <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
            <Link href="/admin/dashboard/datapeminjam" onClick={() => setIsOpen(false)}>
              Peminjam
            </Link>
            <Link href="/admin/dashboard/databuku" onClick={() => setIsOpen(false)}>
              Buku
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
              className="mt-4 px-4 py-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
