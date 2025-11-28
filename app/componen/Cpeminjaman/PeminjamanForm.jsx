"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getBookById, getUserData, pinjamBuku } from "@/app/lib/actions";

const DataRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 px-5 hover:bg-gray-50 transition-colors">
    <span className="text-gray-600 font-medium text-sm">{label}</span>
    <div className="text-gray-900 font-bold text-sm text-right">{value || "-"}</div>
  </div>
);

export default function PeminjamanForm() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [tanggalKembali, setTanggalKembali] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    async function fetchData() {
      try {
        const userId = session.user.id;

        if (!id) throw new Error("ID buku tidak tersedia di URL.");
        const bookData = await getBookById(id);
        if (!bookData) throw new Error("Buku tidak ditemukan.");
        setBook(bookData);

        const userData = await getUserData(userId);
        if (!userData) throw new Error("User tidak ditemukan.");
        setUser(userData);

        const today = new Date();
        const returnDate = new Date(today);
        returnDate.setDate(today.getDate() + 14);
        setTanggalKembali(returnDate.toISOString().split("T")[0]);
      } catch (error) {
        setMessage({ type: "error", text: error.message });
        console.error("fetchData error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, router, session, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!book || !user) {
      setMessage({ type: "error", text: "Data tidak valid." });
      return;
    }
    if (book.stok <= 0) {
      setMessage({ type: "error", text: "Stok buku tidak tersedia." });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("buku_id", book.id);
      formData.append("jumlah", 1);
      formData.append("tanggal_kembali", tanggalKembali);

      const result = await pinjamBuku(formData);
      if (result.success) {
        setMessage({
          type: "success",
          text: "Permintaan peminjaman berhasil diajukan! Tunggu konfirmasi dari admin sebelum mengambil buku.",
        });
      } else {
        setMessage({ type: "error", text: result.error || "Gagal mengajukan peminjaman." });
      }
    } catch (error) {
      console.error("submit error:", error);
      setMessage({ type: "error", text: error.message || "Terjadi kesalahan" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="absolute inset-0 inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Memuat Data Peminjaman...</p>
          <p className="text-gray-500 text-sm mt-2">Mohon tunggu sebentar</p>
        </div>
      </div>
    );

  if (!book || !user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md border-t-4 border-red-500">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Data Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Buku atau data user tidak dapat dimuat</p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/home" className="text-blue-600 hover:text-blue-700 font-medium transition">
            Beranda
          </Link>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/home/detail/${book.id}`} className="text-blue-600 hover:text-blue-700 font-medium transition">
            Detail Buku
          </Link>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600">Form Peminjaman</span>
        </nav>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full -translate-x-1/3 translate-y-1/3"></div>
            </div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Form Peminjaman Buku</h1>
              <p className="text-blue-100">Lengkapi informasi di bawah untuk mengajukan peminjaman</p>
            </div>
          </div>

          {/* Alert Message */}
          {message && (
            <div className="mx-8 mt-6">
              <div
                className={`p-4 rounded-xl font-medium flex items-start gap-3 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border-2 border-green-200"
                    : "bg-red-50 text-red-800 border-2 border-red-200"
                }`}
              >
                {message.type === "success" ? (
                  <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              
              {/* Data Peminjam */}
              <div className="bg-gradient-to-br from-blue-50 to-transparent rounded-2xl border-2 border-blue-100 overflow-hidden shadow-md">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-white font-bold text-lg">Data Peminjam</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  <DataRow label="Nama" value={user.username} />
                  <DataRow label="Email" value={user.email} />
                  <DataRow label="Role" value={<span className="capitalize px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{user.role}</span>} />
                  {user.role === "siswa" ? (
                    <>
                      <DataRow label="NIS" value={user.nis} />
                      <DataRow label="Kelas" value={user.kelas} />
                    </>
                  ) : (
                    <>
                      <DataRow label="NIP" value={user.nip} />
                      <DataRow label="Mata Pelajaran" value={user.mapel} />
                    </>
                  )}
                </div>
              </div>

              {/* Data Buku */}
              <div className="bg-gradient-to-br from-blue-50 to-transparent rounded-2xl border-2 border-blue-100 overflow-hidden shadow-md">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-white font-bold text-lg">Detail Buku</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  <DataRow label="Judul Buku" value={<span className="line-clamp-2">{book.title}</span>} />
                  <DataRow label="Penulis" value={book.author} />
                  <DataRow label="Kategori" value={<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{book.category}</span>} />
                  {book.isbn && <DataRow label="ISBN" value={<span className="font-mono text-xs">{book.isbn}</span>} />}
                  <DataRow
                    label="Stok Tersedia"
                    value={
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                          book.stok > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {book.stok > 0 ? (
                          <>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {book.stok} Buku
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Habis
                          </>
                        )}
                      </span>
                    }
                  />
                  <DataRow
                    label="Batas Kembali"
                    value={
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-blue-600 font-bold">
                          {new Date(tanggalKembali).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>

            {/* Info Notice */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-5 mb-8 flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-amber-900 font-bold mb-2 text-base">Perhatian & Ketentuan Peminjaman</p>
                <ul className="text-amber-800 text-sm space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Buku harus dikembalikan maksimal <strong>14 hari</strong> setelah tanggal peminjaman</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Keterlambatan pengembalian akan dikenakan <strong>sanksi sesuai peraturan</strong> perpustakaan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Tunggu konfirmasi admin sebelum mengambil buku</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={`/home/detail/${book.id}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Batal
              </Link>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || book.stok <= 0}
                className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-xl ${
                  isSubmitting || book.stok <= 0
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-2xl transform hover:-translate-y-0.5"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengajukan...
                  </>
                ) : book.stok <= 0 ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Stok Habis
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ajukan Peminjaman
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}