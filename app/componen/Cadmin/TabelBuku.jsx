"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Link from "next/link";

export default function TabelBuku() {
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
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });

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
    <section className="py-28 px-6 md:px-16 bg-gray-50 min-h-screen">
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

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">Judul</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">Penulis</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">Stok</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {books.map((book, index) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{book.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{book.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{book.stok}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => alert("Edit functionality not implemented yet")}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {books.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Belum ada buku yang ditambahkan.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
