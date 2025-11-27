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
    className={`${className} text-white px-3 py-1 rounded-md transition duration-150 ease-in-out w-full ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
    }`}
  >
    {children}
  </button>
);

export default function TabelPeminjamCardGrid() {
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

  if (peminjaman.length === 0)
    return (
      <div className="p-10 text-center text-gray-500 text-lg">
        Belum ada data peminjaman yang diajukan.
      </div>
    );

  return (
    <section className="-mt-35 min-h-screen bg-gray-50 p-6">
      <div className="mt-10 max-w-7xl mx-auto">
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

        {/* Grid 3 card per row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {peminjaman.map((item, index) => {
            const isProcessing = item.id === processingId;

            // Warna status
            const statusColors = {
              "menunggu konfirmasi": "bg-yellow-100 text-yellow-700",
              "sudah dikonfirmasi": "bg-green-100 text-green-700",
              dipinjam: "bg-orange-50 text-orange-600",
              dikembalikan: "bg-blue-50 text-blue-700",
            };

            // Tombol hapus hanya aktif jika status "dikembalikan"
            const canDelete = item.status === "dikembalikan";

            return (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 transition hover:shadow-lg"
              >
                {/* Info buku & user */}
                <div className="flex flex-col gap-2">
                  <p className="font-extrabold text-lg text-blue-700">{item.judul_buku}</p>
                  <p className="font-semibold text-gray-800">{item.username}</p>
                  <p className="text-gray-600">
                    <span className="font-medium">NIS/NIP:</span> {item.nis || item.nip || "-"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Jumlah:</span> {item.jumlah}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Pinjam:</span> {new Date(item.tanggal_pinjam).toLocaleDateString("id-ID")}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Kembali:</span> {item.tanggal_kembali ? new Date(item.tanggal_kembali).toLocaleDateString("id-ID") : "-"}
                  </p>
                </div>

                {/* Status */}
                <div className={`px-3 py-1 rounded-full font-semibold text-sm ${statusColors[item.status] || "bg-gray-100 text-gray-600"} text-center`}>
                  {item.status.toUpperCase()}
                </div>

                {/* Aksi */}
                <div className="flex flex-col gap-2 mt-2">
                  {item.status === "menunggu konfirmasi" && (
                    <ActionButton
                      onClick={() => handleUbahStatus(item.id, "sudah dikonfirmasi")}
                      className="bg-green-500"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Mengonfirmasi..." : "Konfirmasi"}
                    </ActionButton>
                  )}

                  {item.status === "sudah dikonfirmasi" && (
                    <ActionButton
                      onClick={() => handleUbahStatus(item.id, "dipinjam")}
                      className="bg-orange-500"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Memproses..." : "Pinjamkan"}
                    </ActionButton>
                  )}

                  {item.status === "dipinjam" && (
                    <ActionButton
                      onClick={() => handleUbahStatus(item.id, "dikembalikan")}
                      className="bg-blue-500"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Memproses..." : "Kembali"}
                    </ActionButton>
                  )}

                  <ActionButton
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500"
                    disabled={!canDelete || isProcessing}
                  >
                    {isProcessing ? "Hapus..." : "Hapus"}
                  </ActionButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
