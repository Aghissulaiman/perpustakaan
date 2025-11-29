"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function KategoriBuku() {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch books
        const booksResponse = await fetch("/api/books");
        if (!booksResponse.ok) {
          throw new Error("Failed to fetch books");
        }
        const booksData = await booksResponse.json();
        setBooks(booksData);

        // Extract unique categories from books
        const uniqueCategories = [...new Set(booksData.map(book => book.category))].filter(Boolean);
        setCategories(["Semua", ...uniqueCategories]);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter books based on selected category
  const filteredBooks = selectedCategory === "Semua" 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  // Count books per category
  const getBookCountByCategory = (category) => {
    if (category === "Semua") return books.length;
    return books.filter(book => book.category === category).length;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat kategori buku...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 bg-blue-600 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kategori Buku</h1>
              <p className="text-sm text-gray-600 mt-1">Jelajahi buku berdasarkan kategori</p>
            </div>
          </div>

          {/* Total Categories */}
          <div className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-sm font-bold">{categories.length - 1} Kategori</span>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{category}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {getBookCountByCategory(category)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Category Info */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {selectedCategory === "Semua" ? "Semua Buku" : `Kategori: ${selectedCategory}`}
        </h2>
        <p className="text-gray-600">
          Menampilkan {filteredBooks.length} buku dari {getBookCountByCategory(selectedCategory)} total
        </p>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {selectedCategory === "Semua" ? "Belum Ada Buku" : `Tidak Ada Buku dalam ${selectedCategory}`}
          </h3>
          <p className="text-gray-600">
            {selectedCategory === "Semua" 
              ? "Koleksi buku masih kosong" 
              : `Tidak ada buku yang tersedia dalam kategori ${selectedCategory}`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredBooks.map((book) => (
            <Link 
              key={book.id} 
              href={`/home/detail/${book.id}`}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2">
                
                {/* Book Cover */}
                <div className="relative w-full h-56 bg-gradient-to-br from-blue-50 to-gray-50 overflow-hidden">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-6xl opacity-40">📘</span>
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  <div className="absolute top-2 right-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                      book.stok > 0 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {book.stok > 0 ? `${book.stok} Stok` : 'Habis'}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="text-white font-semibold text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Lihat Detail
                    </span>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm leading-tight min-h-[40px]">
                    {book.title}
                  </h3>
                  
                  <p className="text-xs text-gray-600 mb-3 line-clamp-1">
                    {book.author}
                  </p>

                  {/* Category Tag */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {book.category}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}