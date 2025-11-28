"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  // --- Loading State, Error State, dan Header (sama seperti sebelumnya) ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-medium text-blue-600 animate-pulse">
          Memuat riwayat peminjaman... ⏳
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-lg mx-auto"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  // --- History View ---
  const isHistoryEmpty = history && history.length === 0;

  return (
    <div className="-mt-50 min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto mt-30 bg-white shadow-2xl rounded-xl p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-blue-800 border-b-4 border-blue-600 pb-2">
          Riwayat Peminjaman Saya 
        </h1>

        {/* Notifikasi panduan umum pengambilan buku */}
        <div className="p-4 mb-6 rounded-lg bg-blue-100 text-blue-800 border-l-4 border-blue-500 font-medium">
          <p>
            **Perhatian:** Untuk status **DIPINJAM**, harap segera **menuju ke
            Perpustakaan** untuk mengambil buku Anda pada jam operasional.
            Tunjukkan riwayat ini kepada petugas.
          </p>
        </div>

        {isHistoryEmpty ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.435 9.177 5.038 7.5 5.038c-1.854 0-3.376.852-3.376 1.944 0 1.092 1.522 1.944 3.376 1.944c1.677 0 3.332.397 4.5.992m0 0l1.755 4.388M12 6.253v13M12 6.253l1.755 4.388m0 0c1.168.595 2.823.992 4.5.992 1.854 0 3.376-.852 3.376-1.944 0-1.092-1.522-1.944-3.376-1.944-1.677 0-3.332-.397-4.5-.992"
              />
            </svg>
            <p className="text-gray-500 font-medium text-lg">
              Anda belum pernah melakukan peminjaman buku.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Judul Buku
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Tanggal Pinjam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Batas Kembali
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Tanggal Kembali
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
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
                  
                  // Gunakan toLowerCase() untuk memastikan pemeriksaan status yang konsisten
                  const currentStatus = item.status.toLowerCase();
                  const isLate = currentStatus === "dipinjam" && batasKembali < new Date();

                  let statusClass = "text-gray-800 bg-gray-100";
                  let statusText = item.status.toUpperCase(); // Tetap menggunakan yang asli untuk tampilan
                  let keterangan = null;

                  if (currentStatus === "menunggu konfirmasi") {
                    statusClass = "text-yellow-700 bg-yellow-100";
                    keterangan = "Permintaan sedang diproses Admin.";
                  } else if (currentStatus === "dipinjam") {
                    if (isLate) {
                      statusClass = "text-red-700 bg-red-50";
                      keterangan = "Terlambat. Harap segera kembalikan!";
                    } else {
                      // Status DIPINJAM (sudah dikonfirmasi)
                      statusClass = "text-blue-700 bg-blue-50";
                      // 💡 Keterangan pengambilan buku
                      keterangan = "Harap ambil buku di Perpustakaan.";
                    }
                  } else if (currentStatus === "dikembalikan") {
                    statusClass = "text-green-700 bg-green-50";
                    keterangan =
                      "Terima kasih telah mengembalikan buku tepat waktu.";
                  }

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/50 transition duration-150 ease-in-out"
                    >
                      {/* Judul Buku */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 max-w-xs truncate">
                        {item.judul}
                      </td>

                      {/* Tanggal Pinjam */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(item.tanggal_pinjam).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>

                      {/* Batas Kembali */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isLate
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {batasKembali.toLocaleDateString("id-ID")}
                        </span>
                      </td>

                      {/* Tanggal Kembali */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {tanggalKembali
                          ? tanggalKembali.toLocaleDateString("id-ID")
                          : "-"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col items-start space-y-1">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase ${statusClass}`}
                          >
                            {statusText}
                          </span>
                          {/* KETERANGAN TAMBAHAN */}
                          {keterangan && (
                            <span className="text-xs text-gray-500 italic max-w-[150px]">
                              {keterangan}
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
        )}
      </div>
    </div>
  );
}