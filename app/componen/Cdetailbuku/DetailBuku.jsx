"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getKoleksiBuku } from "@/app/lib/actions";

export default function DetailBuku() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBook() {
      try {
        const data = await getKoleksiBuku();
        const selected = data.find((b) => b.id === parseInt(id));
        setBook(selected);
      } catch (error) {
        console.error("Gagal mengambil detail buku:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Memuat data buku...
      </div>
    );

  if (!book)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Buku tidak ditemukan.
      </div>
    );

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-28 px-6 md:px-16">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Gambar Buku */}
        <div className="bg-gray-100 flex items-center justify-center">
          {book.gambar ? (
            <img
              src={book.gambar}
              alt={book.title}
              className="object-cover w-full h-full md:h-[500px]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-blue-400">
              <span className="text-8xl">📘</span>
              <p className="text-sm mt-2">Tidak ada gambar</p>
            </div>
          )}
        </div>

        {/* Detail Buku */}
        <div className="p-8 md:p-10 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
            <p className="text-gray-500 text-sm mb-2">
              Penulis: <span className="font-medium text-gray-700">{book.author}</span>
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Kategori:{" "}
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {book.category}
              </span>
            </p>

            {/* Stok */}
            <div className="flex items-center mb-6">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  book.stok > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {book.stok > 0
                  ? `${book.stok} buku tersedia`
                  : "Stok habis"}
              </span>
            </div>

            {/* Deskripsi */}
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Deskripsi Buku
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {book.deskripsi || "Tidak ada deskripsi untuk buku ini."}
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/home"
              className="w-full sm:w-auto px-5 py-2.5 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition font-medium"
            >
              ← Kembali
            </Link>

            {book.stok > 0 ? (
              <Link
                href={`/home/detail/${book.id}/peminjaman`}
                className="w-full sm:w-auto px-6 py-2.5 text-white rounded-lg font-medium transition bg-blue-600 hover:bg-blue-700 text-center"
              >
                Pinjam Buku
              </Link>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto px-6 py-2.5 text-white rounded-lg font-medium bg-gray-400 cursor-not-allowed"
              >
                Tidak Tersedia
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
