"use client";

import { useEffect, useState } from "react";
import { BookOpen, CalendarCheck, Clock, LayoutDashboard, Users, Plus, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalBorrowers: 0,
    activeLoans: 0,
    overdueBooks: 0
  });

  useEffect(() => {
    // Fetch stats from API
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch books count
      const booksRes = await fetch("/api/books");
      const books = booksRes.ok ? await booksRes.json() : [];
      const totalBooks = books.length;

      // Fetch borrowers count (you might need to create this API)
      const borrowersRes = await fetch("/api/borrowers");
      const borrowers = borrowersRes.ok ? await borrowersRes.json() : [];
      const totalBorrowers = borrowers.length;

      // Mock data for active loans and overdue
      setStats({
        totalBooks,
        totalBorrowers,
        activeLoans: 5, // This should come from API
        overdueBooks: 2 // This should come from API
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      // Set default values
      setStats({
        totalBooks: 0,
        totalBorrowers: 0,
        activeLoans: 0,
        overdueBooks: 0
      });
    }
  };

  // Access control is handled by withAdmin HOC

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mt-20 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Dashboard Admin</h1>
          <p className="text-gray-600 mt-1">Selamat datang, Admin!</p>
        </div>
        <Link
          href="/admin/dashboard/tambahbuku"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg"
        >
          <Plus size={20} />
          Tambah Buku Baru
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Total Buku</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalBooks}</p>
            </div>
            <BookOpen size={40} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Total Peminjam</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalBorrowers}</p>
            </div>
            <Users size={40} className="text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Peminjaman Aktif</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.activeLoans}</p>
            </div>
            <CalendarCheck size={40} className="text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Buku Terlambat</p>
              <p className="text-3xl font-bold text-red-600">{stats.overdueBooks}</p>
            </div>
            <Clock size={40} className="text-red-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/dashboard/databuku"
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition">
              <BookOpen size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Kelola Buku</h3>
              <p className="text-sm text-gray-600">Tambah, edit, atau hapus buku</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/dashboard/datapeminjam"
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition">
              <Users size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Data Peminjam</h3>
              <p className="text-sm text-gray-600">Lihat dan kelola data peminjam</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/dashboard/laporan"
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition">
              <BarChart3 size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Laporan</h3>
              <p className="text-sm text-gray-600">Lihat laporan peminjaman</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Buku "React Handbook" dipinjam</p>
              <p className="text-sm text-gray-600">Oleh: Ahmad Surya - 2 jam yang lalu</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Buku baru "JavaScript Advanced" ditambahkan</p>
              <p className="text-sm text-gray-600">Oleh: Admin - 1 hari yang lalu</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Buku "Python Basics" terlambat dikembalikan</p>
              <p className="text-sm text-gray-600">Oleh: Sari Dewi - 3 hari yang lalu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
