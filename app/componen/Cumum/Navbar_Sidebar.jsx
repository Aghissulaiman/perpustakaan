"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  History,
  Bookmark,
  Heart,
  Layers,
  Menu,
  LogOut,
  Settings,
  User,
  Search,
  Bell,
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function Navbar_Sidebar({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleLogout = () => signOut({ redirect: true, callbackUrl: "/" });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/home/koleksi?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

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
                alt="Logo Tarpustaka"
                className="w-9 h-auto"
              />
              <h1 className="text-2xl font-bold text-blue-700">Tarpustaka</h1>
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
          <Link className={sidebarLinkClasses} href="/home">
            <Home size={20} className="text-blue-600" />
            {!sidebarCollapsed && <span>Home</span>}
          </Link>
          <Link className={sidebarLinkClasses} href="/home/history">
            <History size={20} className="text-blue-600" />
            {!sidebarCollapsed && <span>History</span>}
          </Link>
          <Link className={sidebarLinkClasses} href="/home/pinjaman">
            <Bookmark size={20} className="text-blue-600" />
            {!sidebarCollapsed && <span>Buku Dipinjam</span>}
          </Link>
          <Link className={sidebarLinkClasses} href="/home/wishlist">
            <Heart size={20} className="text-blue-600" />
            {!sidebarCollapsed && <span>Wishlist Buku</span>}
          </Link>
          <Link className={sidebarLinkClasses} href="/home/kategori">
            <Layers size={20} className="text-blue-600" />
            {!sidebarCollapsed && <span>Kategori</span>}
          </Link>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <main
        className={`transition-all duration-300 w-full ${
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
{/* NAVBAR */}
<nav
  className="w-full border-b border-blue-200 bg-white shadow-sm transition-all duration-300 sticky top-0 z-50"
>
  <div className="flex items-center justify-between px-6 py-4">
    {/* KIRI: Logo + Tarpustaka saat sidebar collapse */}
    {sidebarCollapsed ? (
      <div className="flex items-center gap-2">
        <img
          src="/login-register4.jpg"
          alt="Logo Tarpustaka"
          className="w-9 h-auto"
        />
        <span className="text-xl font-bold text-blue-700">
          Tarpustaka
        </span>
      </div>
    ) : null}

    {/* SEARCH */}
    <div
      className={`flex items-center flex-1 ${
        sidebarCollapsed ? "justify-center" : "justify-start ml-4"
      }`}
    >
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-2 shadow-sm max-w-xs w-full"
      >
        <input
          placeholder="Cari buku..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent w-full outline-none text-sm"
        />
        <button>
          <Search size={18} className="text-blue-600" />
        </button>
      </form>
    </div>

    {/* KANAN: Notifikasi + Profile */}
    <div className="flex items-center gap-4">
      <button className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition">
        <Bell size={20} className="text-blue-600" />
      </button>

      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition"
        >
          <User size={20} className="text-blue-600" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-white border border-blue-200 shadow-xl py-3">
            <Link
              href="/home/profile"
              className={dropdownItemClasses}
              onClick={() => setDropdownOpen(false)}
            >
              <User size={16} className="text-blue-600" /> Profil Saya
            </Link>
            <Link
              href="/home/pengaturan"
              className={dropdownItemClasses}
              onClick={() => setDropdownOpen(false)}
            >
              <Settings size={16} className="text-blue-600" /> Pengaturan
            </Link>
            <div className="border-t border-blue-100 mt-2 pt-2 mx-2">
              <button
                onClick={() => {
                  handleLogout();
                  setDropdownOpen(false);
                }}
                className={`${dropdownItemClasses} text-red-600 hover:bg-red-50`}
              >
                <LogOut size={16} className="text-red-600" /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</nav>


        {/* CONTENT */}
        <div className="pt-24 pb-10">{children}</div>
      </main>
    </div>
  );
}