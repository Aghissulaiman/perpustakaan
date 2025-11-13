"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getKoleksiBuku, getUserData, pinjamBuku } from "@/app/lib/actions";

const DataRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 px-4 border-b border-gray-100 last:border-b-0">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-900 font-semibold">{value || "-"}</span>
  </div>
);

export default function PeminjamanForm() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [tanggalKembali, setTanggalKembali] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const userJson = localStorage.getItem("user");
        if (!userJson) {
          router.push("/login");
          return;
        }

        const loggedInUser = JSON.parse(userJson);
        const userId = loggedInUser.id;

        if (!id) return;

        const bookData = await getKoleksiBuku();
        const selectedBook = bookData.find((b) => b.id === parseInt(id));
        if (!selectedBook) throw new Error("Buku tidak ditemukan.");
        setBook(selectedBook);

        const userData = await getUserData(userId);
        if (!userData) throw new Error("User tidak ditemukan.");
        setUser(userData);

        // 🕒 Auto generate tanggal kembali (14 hari dari sekarang)
        const today = new Date();
        const returnDate = new Date(today);
        returnDate.setDate(today.getDate() + 14);
        setTanggalKembali(returnDate.toISOString().split("T")[0]);
      } catch (error) {
        setMessage({ type: "error", text: error.message });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, router]);

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

    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("buku_id", book.id);
    formData.append("jumlah", 1);
    formData.append("tanggal_kembali", tanggalKembali);

    const result = await pinjamBuku(formData);
    if (result.success) {
      setMessage({
        type: "success",
        text:
          "Permintaan peminjaman berhasil diajukan! Tunggu konfirmasi dari admin sebelum mengambil buku. 📚",
      });
    } else {
      setMessage({ type: "error", text: result.error });
    }

    setIsSubmitting(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-600 text-xl font-medium">
        Memuat data peminjaman... 🔄
      </div>
    );

  if (!book || !user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center border-t-4 border-red-500">
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Data Tidak Ditemukan 🚫
          </h2>
          <Link
            href="/home"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10 border-b-4 border-blue-600 pb-3">
          Ajukan Peminjaman Buku 📝
        </h1>

        {message && (
          <div
            className={`p-4 mb-6 rounded-lg text-center font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Data Peminjam */}
            <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-blue-600 text-white font-bold text-lg p-3">
                👤 Data Peminjam
              </div>
              <DataRow label="Nama" value={user.username} />
              <DataRow label="Email" value={user.email} />
              <DataRow label="Role" value={user.role} />
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

            {/* Data Buku */}
            <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-blue-600 text-white font-bold text-lg p-3">
                📚 Detail Buku
              </div>
              <DataRow label="Judul Buku" value={book.title} />
              <DataRow label="Penulis" value={book.author} />
              <DataRow label="Kategori" value={book.category} />
              <DataRow
                label="Stok"
                value={
                  <span
                    className={`font-bold ${
                      book.stok > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {book.stok}
                  </span>
                }
              />
              <DataRow
                label="Batas Pengembalian"
                value={
                  <span className="text-blue-600 font-bold">
                    {new Date(tanggalKembali).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                }
              />
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center">
            *Buku harus dikembalikan maksimal 14 hari setelah tanggal peminjaman.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Link
              href={`/home/detail/${book.id}`}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || book.stok <= 0}
              className={`px-8 py-3 rounded-lg font-semibold text-white shadow-md ${
                isSubmitting || book.stok <= 0
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting
                ? "Mengajukan..."
                : book.stok <= 0
                ? "Stok Habis"
                : "Ajukan Peminjaman ✅"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
