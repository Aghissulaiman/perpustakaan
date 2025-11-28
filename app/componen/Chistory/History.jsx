"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getHistoryPeminjaman } from "@/app/lib/actions";

export default function History() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    async function fetchHistory() {
      try {
        const userId = session.user.id;
        const data = await getHistoryPeminjaman(userId);
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal memuat histori peminjaman:", err);
        setError("Gagal memuat riwayat peminjaman. Silakan coba lagi nanti.");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [router, session, status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Memuat riwayat peminjaman...
          </p>
          <p className="text-gray-500 mt-2">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const isHistoryEmpty = history && history.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Riwayat Peminjaman Saya
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lacak semua aktivitas peminjaman buku Anda di perpustakaan
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-bold text-lg mb-2">Informasi Penting</h3>
              <p className="text-blue-100">
                Untuk status <span className="font-semibold">DIPINJAM</span>, harap segera menuju ke Perpustakaan 
                untuk mengambil buku pada jam operasional. Tunjukkan riwayat ini kepada petugas.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {isHistoryEmpty ? (
            <div className="text-center py-16 px-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.435 9.177 5.038 7.5 5.038c-1.854 0-3.376.852-3.376 1.944 0 1.092 1.522 1.944 3.376 1.944c1.677 0 3.332.397 4.5.992m0 0l1.755 4.388M12 6.253v13M12 6.253l1.755 4.388m0 0c1.168.595 2.823.992 4.5.992 1.854 0 3.376-.852 3.376-1.944 0-1.092-1.522-1.944-3.376-1.944-1.677 0-3.332-.397-4.5-.992" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Belum Ada Riwayat Peminjaman
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Anda belum pernah melakukan peminjaman buku. Mulailah jelajahi koleksi buku kami dan lakukan peminjaman pertama Anda.
              </p>
              <button
                onClick={() => router.push("/catalog")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105"
              >
                Jelajahi Katalog Buku
              </button>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Buku
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tanggal Pinjam
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Batas Kembali
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Tanggal Kembali
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {history.map((item) => {
                      const batasKembali = new Date(item.tanggal_kembali);
                      const tanggalKembali = item.tanggal_kembali && item.status.toLowerCase() === "dikembalikan"
                        ? new Date(item.tanggal_kembali)
                        : null;
                      
                      const currentStatus = item.status.toLowerCase();
                      const isLate = currentStatus === "dipinjam" && batasKembali < new Date();

                      let statusConfig = {
                        class: "bg-gray-100 text-gray-800",
                        icon: null,
                        keterangan: null
                      };

                      if (currentStatus === "menunggu konfirmasi") {
                        statusConfig = {
                          class: "bg-yellow-100 text-yellow-800 border border-yellow-200",
                          icon: "⏳",
                          keterangan: "Permintaan sedang diproses Admin"
                        };
                      } else if (currentStatus === "dipinjam") {
                        if (isLate) {
                          statusConfig = {
                            class: "bg-red-100 text-red-800 border border-red-200",
                            icon: "⚠️",
                            keterangan: "Terlambat. Harap segera kembalikan!"
                          };
                        } else {
                          statusConfig = {
                            class: "bg-blue-100 text-blue-800 border border-blue-200",
                            icon: "📚",
                            keterangan: "Harap ambil buku di Perpustakaan"
                          };
                        }
                      } else if (currentStatus === "dikembalikan") {
                        statusConfig = {
                          class: "bg-green-100 text-green-800 border border-green-200",
                          icon: "✅",
                          keterangan: "Buku telah dikembalikan"
                        };
                      }

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition duration-150 ease-in-out group"
                        >
                          {/* Buku dengan Gambar */}
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0 relative">
                                <div className="w-16 h-20 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-200">
                                  {item.gambar || item.image || item.cover ? (
                                    <img
                                      src={item.gambar || item.image || item.cover}
                                      alt={item.judul}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div className={`w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center ${item.gambar || item.image || item.cover ? 'hidden' : 'flex'}`}>
                                    <span className="text-2xl text-blue-600">📚</span>
                                  </div>
                                </div>
                                {/* Status dot indicator */}
                                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                  currentStatus === 'dikembalikan' ? 'bg-green-500' :
                                  currentStatus === 'dipinjam' ? (isLate ? 'bg-red-500' : 'bg-blue-500') :
                                  'bg-yellow-500'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                                  {item.judul}
                                </p>
                                {item.penulis && (
                                  <p className="text-xs text-gray-500 line-clamp-1">
                                    oleh {item.penulis}
                                  </p>
                                )}
                                {item.penerbit && (
                                  <p className="text-xs text-gray-400 line-clamp-1">
                                    {item.penerbit}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Tanggal Pinjam */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">
                              {new Date(item.tanggal_pinjam).toLocaleDateString("id-ID", {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </td>

                          {/* Batas Kembali */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              isLate && currentStatus === "dipinjam" 
                                ? "bg-red-100 text-red-800" 
                                : "bg-orange-100 text-orange-800"
                            }`}>
                              {isLate && currentStatus === "dipinjam" && "⚠️ "}
                              {batasKembali.toLocaleDateString("id-ID")}
                            </div>
                          </td>

                          {/* Tanggal Kembali */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">
                              {tanggalKembali
                                ? tanggalKembali.toLocaleDateString("id-ID", {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : "-"}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-2">
                              <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.class}`}>
                                {statusConfig.icon && <span className="mr-1.5">{statusConfig.icon}</span>}
                                {item.status.toUpperCase()}
                              </div>
                              {statusConfig.keterangan && (
                                <span className="text-xs text-gray-500 max-w-[140px] leading-tight">
                                  {statusConfig.keterangan}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Footer dengan statistik */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                  <div className="mb-2 sm:mb-0">
                    Menampilkan <span className="font-semibold">{history.length}</span> riwayat peminjaman
                  </div>
                  <div className="flex space-x-4">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-full mr-1"></span>
                      Dipinjam
                    </span>
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-green-100 border border-green-300 rounded-full mr-1"></span>
                      Dikembalikan
                    </span>
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded-full mr-1"></span>
                      Menunggu
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}