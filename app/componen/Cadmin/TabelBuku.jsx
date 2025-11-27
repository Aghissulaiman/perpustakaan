"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Link from "next/link";

export default function TabelBukuCardGrid() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books");
      if (!response.ok) throw new Error("Failed to fetch books");
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus buku ini?")) return;

    try {
      const response = await fetch(`/api/books/${id}`, { method: "DELETE" });
      console.log(response)
      
      if (!response.ok) throw new Error("Failed to delete book");
      setBooks(books.filter((book) => book.id !== id));
      alert("Buku berhasil dihapus!");
    } catch (err) {
      alert("Gagal menghapus buku: " + err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <section className="-mt-35 py-28 px-6 md:px-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700">Data Buku</h2>
          <Link
            href="/admin/dashboard/tambahbuku"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} /> Tambah Buku
          </Link>
        </div>

        {books.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Belum ada buku yang ditambahkan.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition"
            >
              {/* Bagian atas: gambar + info */}
              <div className="flex gap-4 p-4">
                {book.image && (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-24 h-32 object-cover rounded-lg flex-shrink-0 hover:scale-105 transition"
                  />
                )}

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">ID: {book.id}</p>
                    <p className="font-extrabold text-lg text-blue-700">{book.title}</p>
                    <p className="font-semibold text-gray-800 mb-2">{book.author}</p>
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span><span className="font-medium">Kategori:</span> {book.category}</span>
                      <span><span className="font-medium">Stok:</span> {book.stok}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol aksi di bawah */}
              <div className="flex gap-2 px-4 pb-4 mt-auto">
                <Link href={`/admin/dashboard/databuku/editbuku/${book.id}`}
                  className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition flex justify-center items-center gap-2"
                >
                  <Pencil size={16} /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex justify-center items-center gap-2"
                >
                  <Trash2 size={16} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
