"use client";

import { useEffect, useState } from "react";
import { User, BookOpen, CalendarCheck, Clock, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    dipinjam: 0,
    dikembalikan: 0,
    terlambat: 0
  });

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) setUser(JSON.parse(userJson));

    // Contoh data dummy statistik
    setStats({
      dipinjam: 3,
      dikembalikan: 7,
      terlambat: 1
    });
  }, []);

  if (!user) {
    return (
      <div className=" min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">code 404.</p>
      </div>
    );
  }

  return (
    <div className=" min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mt-20 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-blue-700">Halo, {user.username}!</h1>
      </div>

      {/* Shortcut Menu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Link
          href="/koleksi"
          className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition flex flex-col items-center gap-3 transform hover:-translate-y-1"
        >
          <BookOpen size={36} className="text-blue-600" />
          <p className="font-semibold text-gray-700 text-center">Koleksi Buku</p>
        </Link>

        <Link
          href="/history"
          className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition flex flex-col items-center gap-3 transform hover:-translate-y-1"
        >
          <CalendarCheck size={36} className="text-green-600" />
          <p className="font-semibold text-gray-700 text-center">History Peminjaman</p>
        </Link>

        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center gap-3 transform hover:-translate-y-1">
          <Clock size={36} className="text-red-600" />
          <p className="font-semibold text-gray-700 text-center">Buku Terlambat</p>
          <p className="text-xl font-bold text-red-700">{stats.terlambat}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center gap-3 transform hover:-translate-y-1">
          <BookOpen size={36} className="text-yellow-600" />
          <p className="font-semibold text-gray-700 text-center">Sedang Dipinjam</p>
          <p className="text-xl font-bold text-yellow-700">{stats.dipinjam}</p>
        </div>

        {/* Shortcut khusus admin */}
        {user.role === "admin" && (
          <Link
            href="/admin/dashboard/datapeminjam"
            className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition flex flex-col items-center gap-3 transform hover:-translate-y-1"
          >
            <LayoutDashboard size={36} className="text-purple-600" />
            <p className="font-semibold text-gray-700 text-center">Kelola Data Peminjam</p>
          </Link>
        )}
      </div>

      {/* Ringkasan Statistik */}
      <div className="bg-white shadow-2xl rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Ringkasan Peminjaman</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-xl flex flex-col items-center shadow hover:shadow-lg transition">
            <p className="text-gray-600 font-semibold">Dipinjam</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.dipinjam}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl flex flex-col items-center shadow hover:shadow-lg transition">
            <p className="text-gray-600 font-semibold">Dikembalikan</p>
            <p className="text-2xl font-bold text-green-600">{stats.dikembalikan}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl flex flex-col items-center shadow hover:shadow-lg transition">
            <p className="text-gray-600 font-semibold">Terlambat</p>
            <p className="text-2xl font-bold text-red-600">{stats.terlambat}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
