"use client";

import { useEffect, useState } from "react";
import { BookOpen, CalendarCheck, Clock, Users, Plus, BarChart3 } from "lucide-react";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalBorrowers: 0,
    activeLoans: 0,
    overdueBooks: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [borrowTrends, setBorrowTrends] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [dailyActivity, setDailyActivity] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
    fetchBorrowTrends();
    fetchCategoryStats();
    fetchDailyActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const booksRes = await fetch("/api/books");
      const books = booksRes.ok ? await booksRes.json() : [];

      const borrowersRes = await fetch("/api/borrowers");
      const borrowers = borrowersRes.ok ? await borrowersRes.json() : [];

      const loansRes = await fetch("/api/loans");
      const loans = loansRes.ok ? await loansRes.json() : [];

      const activeLoans = loans.filter((l) => l.status === "dipinjam").length;
      const overdueBooks = loans.filter(
        (l) => l.tanggal_kembali && new Date(l.tanggal_kembali) < new Date() && l.status !== "dikembalikan"
      ).length;

      setStats({
        totalBooks: books.length,
        totalBorrowers: borrowers.length,
        activeLoans,
        overdueBooks,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await fetch("/api/loans?recent=true");
      const data = res.ok ? await res.json() : [];
      setRecentActivity(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBorrowTrends = async () => {
    try {
      const trends = [
        { day: "Mon", borrows: 3 },
        { day: "Tue", borrows: 5 },
        { day: "Wed", borrows: 2 },
        { day: "Thu", borrows: 6 },
        { day: "Fri", borrows: 4 },
        { day: "Sat", borrows: 7 },
        { day: "Sun", borrows: 1 },
      ];
      setBorrowTrends(trends);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategoryStats = async () => {
    try {
      const res = await fetch("/api/books");
      const books = res.ok ? await res.json() : [];
      const categories = {};
      books.forEach((b) => {
        categories[b.category] = (categories[b.category] || 0) + 1;
      });
      const data = Object.keys(categories).map((key) => ({ category: key, count: categories[key] }));
      setCategoryStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDailyActivity = async () => {
    try {
      const res = await fetch("/api/loans");
      const loans = res.ok ? await res.json() : [];
      const daily = {};
      loans.forEach((l) => {
        const day = new Date(l.tanggal_pinjam).toLocaleDateString("id-ID", { weekday: "short" });
        daily[day] = (daily[day] || 0) + 1;
      });
      const data = Object.keys(daily).map((day) => ({ day, borrows: daily[day] }));
      setDailyActivity(data);
    } catch (err) {
      console.error(err);
    }
  };

  const pieData = [
    { name: "Aktif", value: stats.activeLoans, color: "#facc15" },
    { name: "Terlambat", value: stats.overdueBooks, color: "#f87171" },
  ];

  return (
    <div className="-mt-40 min-h-screen bg-gray-50 p-6">
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
          <Plus size={20} /> Tambah Buku Baru
        </Link>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Buku" value={stats.totalBooks} icon={<BookOpen size={40} className="text-blue-500" />} color="blue" />
        <StatCard title="Total Peminjam" value={stats.totalBorrowers} icon={<Users size={40} className="text-green-500" />} color="green" />
        <StatCard title="Peminjaman Aktif" value={stats.activeLoans} icon={<CalendarCheck size={40} className="text-yellow-500" />} color="yellow" />
        <StatCard title="Buku Terlambat" value={stats.overdueBooks} icon={<Clock size={40} className="text-red-500" />} color="red" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar chart tren peminjaman */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="font-semibold text-gray-800 mb-4">Tren Peminjaman Mingguan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={borrowTrends}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="borrows" radius={[10, 10, 0, 0]} fill="url(#gradientBorrows)" />
              <defs>
                <linearGradient id="gradientBorrows" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart status */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="font-semibold text-gray-800 mb-4">Status Peminjaman</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart kategori buku */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="font-semibold text-gray-800 mb-4">Jumlah Buku per Kategori</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryStats}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" radius={[8,8,0,0]} fill="url(#gradientCategory)" />
              <defs>
                <linearGradient id="gradientCategory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart aktivitas harian */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="font-semibold text-gray-800 mb-4">Aktivitas Peminjaman Harian</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dailyActivity}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="borrows" stroke="#f59e0b" strokeWidth={3} fill="url(#gradientLine)" />
              <defs>
                <linearGradient id="gradientLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.5}/>
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          {recentActivity.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className={`w-2 h-2 rounded-full ${item.type === "borrow" ? "bg-green-500" : item.type === "return" ? "bg-blue-500" : "bg-red-500"}`}></div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.message}</p>
                <p className="text-sm text-gray-600">{item.user} - {new Date(item.date).toLocaleString("id-ID")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Statistic Card Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 font-medium">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}
