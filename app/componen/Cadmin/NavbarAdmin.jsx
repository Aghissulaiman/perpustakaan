"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Plus,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function NavbarAdmin({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => signOut({ callbackUrl: "/" });

  const sidebarLinkClasses =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:bg-blue-50";

  const dropdownItemClasses =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:bg-blue-50";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-xl border-r border-blue-200 transition-all duration-300 hidden md:flex flex-col z-50 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo + Hamburger */}
        <div className="flex justify-between items-center px-3 mt-3">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <img
                src="/login-register4.jpg"
                alt="Logo Admin"
                className="w-9 h-auto"
              />
              <h1 className="text-2xl font-bold text-blue-700">Admin TB</h1>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-xl border border-blue-200 hover:bg-blue-50 transition-all"
          >
            <Menu size={22} className="text-blue-600" />
          </button>
        </div>

        {/* Menu List */}
        <nav className="flex flex-col space-y-2 font-medium text-gray-700 px-2 mt-2">
          <Link className={sidebarLinkClasses} href="/admin/dashboard/anggota">
            <User size={20} className="text-blue-600" />
            {!sidebarCollapsed && <span>Anggota</span>}
          </Link>
          <Link className={sidebarLinkClasses} href="/admin/dashboard">
            <LayoutDashboard size={20} className="text-blue-600" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>
          <Link className={sidebarLinkClasses} href="/admin/dashboard/datapeminjam">
            <CalendarCheck size={20} className="text-blue-600" />
            {!sidebarCollapsed && <span>Peminjam</span>}
          </Link>
          <Link className={sidebarLinkClasses} href="/admin/dashboard/databuku">
            <BookOpen size={20} className="text-blue-600" />
            {!sidebarCollapsed && <span>Buku</span>}
          </Link>
          <Link className={sidebarLinkClasses} href="/admin/dashboard/tambahbuku">
            <Plus size={20} className="text-blue-600" />
            {!sidebarCollapsed && <span>Tambah Buku</span>}
          </Link>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <main className={`transition-all duration-300 w-full ${sidebarCollapsed ? "md:ml-16" : "md:ml-64"}`}>
        {/* NAVBAR */}
        <nav className="w-full border-b border-blue-200 bg-white shadow-sm transition-all duration-300 sticky top-0 z-50">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo di navbar saat collapsed */}
            {sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <img
                  src="/login-register4.jpg"
                  alt="Logo Admin"
                  className="w-9 h-auto"
                />
                <span className="text-xl font-bold text-blue-700">Admin TB</span>
              </div>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-blue-700 transition duration-300"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* DROPDOWN PROFILE */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition"
              >
                <User size={20} className="text-blue-600" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-blue-200 shadow-xl py-3">
                  <Link href="/admin/profile" className={dropdownItemClasses} onClick={() => setDropdownOpen(false)}>
                    <User size={16} className="text-blue-600" /> Profil Saya
                  </Link>
                  <Link href="/admin/settings" className={dropdownItemClasses} onClick={() => setDropdownOpen(false)}>
                    <Settings size={16} className="text-blue-600" /> Pengaturan
                  </Link>
                  <div className="border-t border-blue-100 mt-2 pt-2 mx-2">
                    <button
                      onClick={() => { handleLogout(); setDropdownOpen(false); }}
                      className={`${dropdownItemClasses} text-red-600 hover:bg-red-50`}
                    >
                      <LogOut size={16} className="text-red-600" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE MENU */}
          {mobileMenuOpen && (
            <div className="md:hidden mx-4 mb-3 p-5 rounded-2xl bg-white/90 border border-blue-100 shadow-md backdrop-blur-md transition-all duration-300">
              <div className="flex flex-col space-y-4 font-medium text-gray-800 text-sm">
                <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <Link href="/admin/dashboard/datapeminjam" onClick={() => setMobileMenuOpen(false)}>Peminjam</Link>
                <Link href="/admin/dashboard/databuku" onClick={() => setMobileMenuOpen(false)}>Buku</Link>
                <Link
                  href="/admin/dashboard/tambahbuku"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-300"
                >
                  <Plus size={16} /> Tambah Buku
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="mt-4 px-4 py-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* CONTENT */}
        <div className="pt-24 pb-10">{children}</div>
      </main>
    </div>
  );
}
