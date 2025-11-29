"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { addToWishlist, removeFromWishlist, isBookInWishlist, getWishlistCount } from "../../lib/actions";

export default function DaftarBuku() {
  const { data: session } = useSession();
  const [books, setBooks] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingWishlist, setLoadingWishlist] = useState({});

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

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("bookWishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }

    fetchBooks();
  }, []);

  // Toggle wishlist
  const toggleWishlist = async (book) => {
    if (!session?.user?.id) {
      alert("Silakan login terlebih dahulu untuk menambahkan ke wishlist");
      return;
    }

    setLoadingWishlist(prev => ({ ...prev, [book.id]: true }));

    try {
      const isInWishlist = wishlistStatus[book.id] || false;

      if (isInWishlist) {
        await removeFromWishlist(session.user.id, book.id);
        setWishlistCount(prev => prev - 1);
        setWishlistStatus(prev => ({ ...prev, [book.id]: false }));
        alert(`"${book.title}" berhasil dihapus dari wishlist!`);
      } else {
        await addToWishlist(session.user.id, book.id);
        setWishlistCount(prev => prev + 1);
        setWishlistStatus(prev => ({ ...prev, [book.id]: true }));
        alert(`"${book.title}" berhasil ditambahkan ke wishlist!`);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert(error.message || "Gagal memperbarui wishlist");
    } finally {
      setLoadingWishlist(prev => ({ ...prev, [book.id]: false }));
    }
  };

  // Check if book is in wishlist
  const checkIsInWishlist = async (bookId) => {
    if (!session?.user?.id) return false;

    try {
      return await isBookInWishlist(session.user.id, bookId);
    } catch (error) {
      console.error("Error checking wishlist:", error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat daftar buku...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Koleksi Buku</h1>
              <p className="text-sm text-gray-600 mt-1">Temukan buku favorit Anda</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Wishlist Counter */}
            <Link
              href="/home/wishlist"
              className="flex items-center gap-2 px-5 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl shadow-lg transition-all duration-300 group"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-bold">{wishlistCount} Wishlist</span>
            </Link>

            {/* Total Books */}
            <div className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-sm font-bold">{books.length} Buku</span>
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Buku</h3>
          <p className="text-gray-600">Koleksi buku masih kosong</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {books.map((book) => (
            <div key={book.id} className="group relative">
              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(book)}
                disabled={loadingWishlist[book.id]}
                className={`absolute top-3 left-3 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 ${
                  wishlistStatus[book.id]
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-pink-500'
                } ${loadingWishlist[book.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loadingWishlist[book.id] ? (
                  <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill={wishlistStatus[book.id] ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </button>

              <Link href={`/home/detail/${book.id}`}>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}