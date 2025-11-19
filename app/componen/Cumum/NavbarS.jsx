"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, Settings, User, BookOpen, Search } from "lucide-react";
import { signOut } from "next-auth/react";


export default function NavbarS() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // ⬅️ state search
  const dropdownRef = useRef(null);
  const router = useRouter();

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

const handleLogout = async () => {
  await signOut({ redirect: true, callbackUrl: "/" });
};

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/home/koleksi?search=${searchQuery}`);
    setSearchQuery("");
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] z-50 rounded-2xl border backdrop-blur-lg transition-all duration-300 ${
        scrolled
          ? "bg-white/90 border-blue-100 shadow-md"
          : "bg-white/70 border-gray-100 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        
        {/* Logo + Menu */}
        <div className="flex items-center gap-8">
          <Link href="/home" className="flex items-center gap-3">
            <img src="/login-register4.jpg" className="h-9 border-blue-200 shadow-sm" />
            <span className="text-lg font-semibold tracking-wide text-blue-700">
              Tarpustaka
            </span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-6 font-medium text-black">
            <Link href="/home" className="hover:text-blue-600">Beranda</Link>
            <Link href="/home/koleksi" className="hover:text-blue-600">Koleksi</Link>
          </div>
        </div>

        {/* === SEARCH BAR DESKTOP === */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex w-72 items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-2 shadow-sm"
        >
          <input
            type="text"
            placeholder="Cari buku..."
            className="text-black bg-transparent w-full outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <Search className="text-blue-600" size={18} />
          </button>
        </form>

        {/* Profile */}
        <div className="hidden md:flex items-center">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full border border-blue-300 bg-blue-100 flex items-center justify-center shadow-sm hover:ring-2 hover:ring-blue-300 transition-all"
            >
              <User size={20} className="text-blue-600" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl border border-blue-200/50 rounded-2xl shadow-xl py-3 text-sm text-gray-700 animate-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-blue-100 mb-2">
                  <p className="font-medium text-blue-700">Menu Akun</p>
                </div>
                <Link href="/home/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50/80 rounded-lg mx-2 transition-all duration-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User size={16} className="text-blue-600"/>
                  </div>
                  <span>Profil Saya</span>
                </Link>
                <Link href="/home/history" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50/80 rounded-lg mx-2 transition-all duration-200">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <BookOpen size={16} className="text-green-600"/>
                  </div>
                  <span>History Peminjaman</span>
                </Link>
                <Link href="/home/pengaturan" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50/80 rounded-lg mx-2 transition-all duration-200">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Settings size={16} className="text-purple-600"/>
                  </div>
                  <span>Pengaturan</span>
                </Link>
                <div className="border-t border-blue-100 mt-2 pt-2 mx-2">
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50/80 rounded-lg transition-all duration-200">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <LogOut size={16} className="text-red-600"/>
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-blue-700">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* === MOBILE MENU === */}
      {isOpen && (
        <div className="md:hidden mx-4 mb-3 p-5 rounded-2xl bg-white/90 border border-blue-100 shadow-md">
          
          {/* Search Mobile */}
          <form
            onSubmit={handleSearch}
            className="text-black flex w-full items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-2 shadow-sm mb-4"
          >
            <input
              type="text"
              placeholder="Cari buku..."
              className="bg-transparent text-black w-full outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <Search className="text-blue-600" size={18} />
            </button>
          </form>

          <div className="flex flex-col space-y-4 font-medium text-gray-800 text-sm">
            <Link href="/home" onClick={() => setIsOpen(false)}>Beranda</Link>
            <Link href="/home/koleksi" onClick={() => setIsOpen(false)}>Koleksi</Link>
            <Link href="/home/profile" onClick={() => setIsOpen(false)}>Profil</Link>
            <Link href="/home/history" onClick={() => setIsOpen(false)}>History Peminjaman</Link>

            <div className="flex flex-col gap-3 pt-4 border-t border-blue-100">
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="px-4 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
