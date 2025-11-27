"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DaftarBuku() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 mb-8 text-left border-l-4 border-blue-500 pl-4">
            Daftar Buku
          </h2>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Memuat daftar buku...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 mb-8 text-left border-l-4 border-blue-500 pl-4">
            Daftar Buku
          </h2>
          <div className="text-center py-12">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 mb-8 text-left border-l-4 border-blue-500 pl-4">
          Daftar Buku
        </h2>

        {books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Tidak ada buku tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Link ke detail */}
                <Link href={`/home/detail/${book.id}`}>
                  <div className="w-full h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {book.image ? (
                      <img
                        src={book.image}
                        // src={book.image.startsWith('http') ? book.image : `/${book.image.replace(/^\/+/, '')}`}
                        alt={book.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-4xl">📘</span>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {book.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      Stok: {book.stok}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
