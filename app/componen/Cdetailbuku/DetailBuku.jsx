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
      <div className=" min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-3 text-gray-600 font-medium">Memuat data buku...</p>
        </div>
      </div>
    );

  if (!book)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-7xl mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Buku Tidak Ditemukan</h2>
          <p className="text-gray-600 text-sm mb-6">Maaf, buku yang Anda cari tidak tersedia dalam koleksi kami.</p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );

  return (
    <div className="-mt-28 p-6 max-w-6xl mx-auto">
      
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm">
        <Link href="/home" className="text-blue-600 hover:text-blue-700 font-medium transition">
          Beranda
        </Link>
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-600">Detail Buku</span>
      </nav>

      {/* Main Content - Side by Side Layout */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          
          {/* Left Side - Image */}
          <div className="lg:col-span-2 relative bg-gradient-to-br from-blue-100 to-blue-50 p-8 flex items-center justify-center min-h-[400px]">
            {book.image ? (
              <div className="relative group">
                <img
                  src={book.image}
                  alt={book.title}
                  className="max-h-[350px] w-auto object-contain drop-shadow-2xl rounded-lg transform transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => (e.target.src = "/no-image.png")}
                />
              </div>
            ) : (
              <div className="text-center">
                <div className="text-9xl mb-3 opacity-40">📘</div>
                <p className="text-blue-400 font-medium text-sm">Tidak ada gambar</p>
              </div>
            )}
            
            {/* Availability Badge - Positioned in Image Section */}
            <div className="absolute top-6 right-6">
              <div
                className={`px-4 py-2 rounded-full font-bold text-xs shadow-lg backdrop-blur-sm ${
                  book.stok > 0
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {book.stok > 0 ? `✓ ${book.stok} Tersedia` : "✕ Stok Habis"}
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="lg:col-span-3 p-8 flex flex-col justify-between">
            
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-5 leading-tight">
                {book.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Penulis</p>
                    <p className="text-base font-bold text-gray-800">{book.author}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Kategori</p>
                    <p className="text-base font-bold text-blue-600">{book.category}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gradient-to-br from-blue-50 to-transparent rounded-xl p-5 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  Deskripsi
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                  {book.deskripsi || "Tidak ada deskripsi untuk buku ini."}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <Link
                href="/home"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </Link>

              {book.stok > 0 ? (
                <Link
                  href={`/home/detail/${book.id}/peminjaman`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 font-semibold text-sm shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Pinjam Buku Sekarang
                </Link>
              ) : (
                <button
                  disabled
                  className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-300 text-gray-500 rounded-xl font-semibold text-sm cursor-not-allowed opacity-60"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Tidak Tersedia
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}