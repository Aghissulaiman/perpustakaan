"use client";

import { useEffect, useState } from "react";
import {
  getAllPeminjaman,
  updateStatusPeminjaman,
  deletePeminjaman,
} from "@/app/lib/actions";

const ActionButton = ({ onClick, className, children, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${className} text-white px-3 py-1 rounded-md transition duration-150 ease-in-out ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
    }`}
  >
    {children}
  </button>
);

export default function TabelPeminjam() {
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchData = async () => {
    try {
      const data = await getAllPeminjaman();
      setPeminjaman(data);
    } catch (err) {
      console.error(err);
      setMessage("Gagal memuat data peminjaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUbahStatus = async (id, status) => {
    const confirmChange = confirm(`Yakin ingin ubah status jadi "${status}"?`);
    if (!confirmChange) return;

    setProcessingId(id);
    const result = await updateStatusPeminjaman(id, status);

    if (result.success) {
      // Update status langsung di tabel tanpa reload
      setPeminjaman((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    }

    setMessage(result.success || result.error);
    setProcessingId(null);
  };

  const handleDelete = async (id) => {
    const confirmDel = confirm("Yakin ingin menghapus data ini?");
    if (!confirmDel) return;

    setProcessingId(id);
    const result = await deletePeminjaman(id);
    if (result.success) {
      setPeminjaman((prev) => prev.filter((item) => item.id !== id));
    }

    setMessage(result.success || result.error);
    setProcessingId(null);
  };

  if (loading)
    return (
      <div className="p-10 text-center text-blue-600 font-medium text-lg">
        Memuat data peminjaman... 🔄
      </div>
    );

  return (
    <section className="min-h-screen bg-gray-50 p-6">
      <div className="mt-10 max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-600">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6 border-b pb-2">
          Dashboard Admin - Permintaan Peminjaman 📚
        </h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded-md font-semibold ${
              message.includes("Gagal") || message.includes("error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm text-left shadow-md">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 border border-blue-700">#</th>
                <th className="p-3 border border-blue-700">Nama User</th>
                <th className="p-3 border border-blue-700">NIS/NIP</th>
                <th className="p-3 border border-blue-700">Judul Buku</th>
                <th className="p-3 border border-blue-700 text-center">Jml</th>
                <th className="p-3 border border-blue-700">Tgl Pinjam</th>
                <th className="p-3 border border-blue-700">Tgl Kembali</th>
                <th className="p-3 border border-blue-700">Status</th>
                <th className="p-3 border border-blue-700 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {peminjaman.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-6 text-gray-500 bg-gray-50"
                  >
                    Belum ada data peminjaman yang diajukan.
                  </td>
                </tr>
              ) : (
                peminjaman.map((item, index) => {
                  const isProcessing = item.id === processingId;

                  return (
                    <tr
                      key={item.id}
                      className="text-gray-800 border-b hover:bg-blue-50 transition"
                    >
                      <td className="p-3 border">{index + 1}</td>
                      <td className="p-3 border font-medium">
                        {item.username}
                      </td>
                      <td className="p-3 border">
                        {item.nis || item.nip || "-"}
                      </td>
                      <td className="p-3 border">{item.judul_buku}</td>
                      <td className="p-3 border text-center">{item.jumlah}</td>
                      <td className="p-3 border">
                        {new Date(item.tanggal_pinjam).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
                      <td className="p-3 border">
                        {item.tanggal_kembali
                          ? new Date(item.tanggal_kembali).toLocaleDateString(
                              "id-ID"
                            )
                          : "-"}
                      </td>
                      <td
                        className={`p-3 border font-bold text-sm ${
                          item.status === "menunggu konfirmasi"
                            ? "text-yellow-700 bg-yellow-100"
                            : item.status === "sudah dikonfirmasi"
                            ? "text-green-700 bg-green-100"
                            : item.status === "dipinjam"
                            ? "text-orange-600 bg-orange-50"
                            : item.status === "dikembalikan"
                            ? "text-blue-700 bg-blue-50"
                            : "text-gray-600"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </td>

                      <td className="p-3 border text-center space-x-2">
                        {/* Tombol sesuai urutan status */}
                        {item.status === "menunggu konfirmasi" && (
                          <ActionButton
                            onClick={() =>
                              handleUbahStatus(item.id, "sudah dikonfirmasi")
                            }
                            className="bg-green-500"
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Mengonfirmasi..." : "Konfirmasi"}
                          </ActionButton>
                        )}

                        {item.status === "sudah dikonfirmasi" && (
                          <ActionButton
                            onClick={() =>
                              handleUbahStatus(item.id, "dipinjam")
                            }
                            className="bg-orange-500"
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Memproses..." : "Pinjamkan"}
                          </ActionButton>
                        )}

                        {item.status === "dipinjam" && (
                          <ActionButton
                            onClick={() =>
                              handleUbahStatus(item.id, "dikembalikan")
                            }
                            className="bg-blue-500"
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Memproses..." : "Kembali"}
                          </ActionButton>
                        )}

                        {/* Tombol hapus selalu muncul */}
                        <ActionButton
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500"
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Hapus..." : "Hapus"}
                        </ActionButton>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
