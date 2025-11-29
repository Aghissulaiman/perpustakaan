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
  X,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { getAllPeminjaman } from "@/app/lib/actions"; // Import fungsi untuk mengambil data peminjaman

export default function Navbar_Sidebar({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data notifikasi dari peminjaman
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const dataPeminjaman = await getAllPeminjaman();
        
        // Transform data peminjaman menjadi notifikasi
        const transformedNotifications = dataPeminjaman.map(peminjaman => {
          let notification = {
            id: peminjaman.id,
            title: "",
            message: "",
            time: "",
            read: false,
            type: "info", // default, bisa diubah berdasarkan status
            status: peminjaman.status,
            bukuId: peminjaman.buku_id,
            userId: peminjaman.user_id
          };

          // Sesuaikan notifikasi berdasarkan status peminjaman
          switch (peminjaman.status) {
            case "menunggu konfirmasi":
              notification.title = "Menunggu Konfirmasi";
              notification.message = `Peminjaman "${peminjaman.judul_buku}" oleh ${peminjaman.username} menunggu konfirmasi`;
              notification.type = "warning";
              break;
            case "sudah dikonfirmasi":
              notification.title = "Peminjaman Dikonfirmasi";
              notification.message = `Peminjaman "${peminjaman.judul_buku}" telah dikonfirmasi`;
              notification.type = "info";
              break;
            case "dipinjam":
              notification.title = "Buku Dipinjam";
              notification.message = `"${peminjaman.judul_buku}" sedang dipinjam oleh ${peminjaman.username}`;
              notification.type = "success";
              break;
            case "dikembalikan":
              notification.title = "Buku Dikembalikan";
              notification.message = `"${peminjaman.judul_buku}" telah dikembalikan`;
              notification.type = "success";
              break;
            default:
              notification.title = "Peminjaman Baru";
              notification.message = `Peminjaman buku "${peminjaman.judul_buku}"`;
          }

          // Hitung waktu relatif
          const pinjamDate = new Date(peminjaman.tanggal_pinjam);
          const now = new Date();
          const diffTime = Math.abs(now - pinjamDate);
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
          const diffMinutes = Math.floor(diffTime / (1000 * 60));

          if (diffDays > 0) {
            notification.time = `${diffDays} hari lalu`;
          } else if (diffHours > 0) {
            notification.time = `${diffHours} jam lalu`;
          } else if (diffMinutes > 0) {
            notification.time = `${diffMinutes} menit lalu`;
          } else {
            notification.time = "Baru saja";
          }

          return notification;
        });

        // Urutkan dari yang terbaru
        transformedNotifications.sort((a, b) => new Date(b.time) - new Date(a.time));
        setNotifications(transformedNotifications);

      } catch (error) {
        console.error("Error fetching notifications:", error);
        // Fallback notifications jika error
        setNotifications([
          {
            id: 1,
            title: "Sistem Notifikasi",
            message: "Gagal memuat notifikasi terbaru",
            time: "Baru saja",
            read: true,
            type: "error"
          }
        ]);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleLogout = () => signOut({ redirect: true, callbackUrl: "/" });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/home/koleksi?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  // Fungsi untuk menandai notifikasi sebagai sudah dibaca
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Fungsi untuk menandai semua notifikasi sebagai sudah dibaca
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const sidebarLinkClasses =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:bg-blue-50";

  const dropdownItemClasses =
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:bg-blue-50";

  // Hitung jumlah notifikasi yang belum dibaca
  const unreadCount = notifications.filter(notif => !notif.read).length;

  // Icon berdasarkan jenis notifikasi
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} className="text-green-500" />;
      case "warning":
        return <Clock size={16} className="text-yellow-500" />;
      case "error":
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Bell size={16} className="text-blue-500" />;
    }
  };

  // Background color berdasarkan jenis notifikasi
  const getNotificationBgColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-25";
      case "warning":
        return "bg-yellow-25";
      case "error":
        return "bg-red-25";
      default:
        return "bg-blue-25";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR - tetap sama */}
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
        <nav className="w-full border-b border-blue-200 bg-white shadow-sm transition-all duration-300 sticky top-0 z-50">
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
              {/* Notifikasi Button */}
              <div ref={notificationRef} className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition"
                >
                  <Bell size={20} className="text-blue-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifikasi Dropdown */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-blue-200 shadow-xl rounded-lg z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-blue-100">
                      <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Tandai semua dibaca
                          </button>
                        )}
                        <button
                          onClick={() => setNotificationOpen(false)}
                          className="p-1 hover:bg-blue-50 rounded-full transition"
                        >
                          <X size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Notifikasi List */}
                    <div className="max-h-96 overflow-y-auto">
                      {loadingNotifications ? (
                        <div className="p-8 text-center text-gray-500">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p>Memuat notifikasi...</p>
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`p-4 border-b border-blue-50 hover:bg-blue-50 transition cursor-pointer ${
                              !notification.read ? getNotificationBgColor(notification.type) : ""
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-medium text-gray-800 text-sm">
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                                  )}
                                </div>
                                <p className="text-gray-600 text-sm mb-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <span className="text-xs text-gray-400">
                                  {notification.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                          <p>Tidak ada notifikasi</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-blue-100 bg-gray-50">
                      <Link 
                        href="/home/history"
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 block"
                        onClick={() => setNotificationOpen(false)}
                      >
                        Lihat Semua Notifikasi
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown - tetap sama */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition"
                >
                  <User size={20} className="text-blue-600" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-blue-200 shadow-xl py-3 rounded-lg">
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