"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getKoleksiBuku } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";

export default function Koleksi() {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const categories = ["Semua", "Jurusan", "Umum", "Novel"];
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    async function fetchBooks() {
      try {
        const data = await getKoleksiBuku();
        setBooks(data);
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
      }
    }
    fetchBooks();
  }, []);

  // Filter berdasarkan kategori dan search
  let filteredBooks = selectedCategory === "Semua"
    ? books
    : books.filter((b) => b.category === selectedCategory);

  if (searchQuery) {
    filteredBooks = filteredBooks.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <section className="py-28 px-6 md:px-16 bg-gray-50 min-h-screen">
      {/* Judul */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl md:text-2xl font-semibold text-blue-700 border-l-4 border-blue-500 pl-3">
          Semua Koleksi Buku
        </h2>

        <Link
          href="/home"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Kembali
        </Link>
      </div>

      {/* Filter kategori - hanya tampil jika tidak ada search query */}
      {!searchQuery && (
        <div className="flex flex-wrap justify-start gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid seluruh buku */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <div className="w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-5xl">📘</span>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {book.title}
              </h3>
              <p className="text-sm text-gray-500 mb-1">by {book.author}</p>
              {book.isbn && (
                <p className="text-xs text-gray-400 mb-2">ISBN: {book.isbn}</p>
              )}
              <span className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-4">
                {book.category}
              </span>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {book.deskripsi}
              </p>

              <Link
                href={`/home/detail/${book.id}`}
                className="block text-center w-full text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Lihat Detail
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Jika kosong */}
      {filteredBooks.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          {searchQuery ? `Tidak ada buku yang cocok dengan "${searchQuery}".` : "Tidak ada buku di kategori ini."}
        </p>
      )}
    </section>
  );
}
