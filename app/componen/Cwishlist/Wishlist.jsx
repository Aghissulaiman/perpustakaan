"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getUserWishlist, removeFromWishlist, clearWishlist } from "../../lib/actions";

export default function Wishlist() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingRemove, setLoadingRemove] = useState({});
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    fetchWishlist();
  }, [router, session, status]);

  const fetchWishlist = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const data = await getUserWishlist(session.user.id);
      setWishlist(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError("Gagal memuat wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (bookId, bookTitle) => {
    if (!session?.user?.id) return;

    setLoadingRemove(prev => ({ ...prev, [bookId]: true }));

    try {
      await removeFromWishlist(session.user.id, bookId);
      setWishlist(prev => prev.filter(item => item.id !== bookId));
      alert(`"${bookTitle}" berhasil dihapus dari wishlist!`);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert(error.message);
    } finally {
      setLoadingRemove(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const toggleSelectBook = (bookId) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const selectAllBooks = () => {
    if (selectedBooks.length === wishlist.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(wishlist.map(book => book.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBooks.length === 0) return;

    const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus ${selectedBooks.length} buku yang dipilih?`);
    if (!confirmDelete) return;

    try {
      for (const bookId of selectedBooks) {
        await removeFromWishlist(session.user.id, bookId);
      }
      setWishlist(prev => prev.filter(item => !selectedBooks.includes(item.id)));
      setSelectedBooks([]);
      setIsSelecting(false);
      alert(`${selectedBooks.length} buku berhasil dihapus dari wishlist!`);
    } catch (error) {
      console.error("Error deleting selected books:", error);
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Memuat wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={fetchWishlist}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Wishlist Saya</h1>
              <p className="text-gray-600">{wishlist.length} buku dalam wishlist</p>
            </div>

            <div className="flex items-center gap-3">
              {wishlist.length > 0 && (
                <>
                  {isSelecting ? (
                    <>
                      <button
                        onClick={selectAllBooks}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        {selectedBooks.length === wishlist.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                      </button>
                      {selectedBooks.length > 0 && (
                        <button
                          onClick={handleDeleteSelected}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Hapus ({selectedBooks.length})
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setIsSelecting(false);
                          setSelectedBooks([]);
                        }}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsSelecting(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Pilih Buku
                    </button>
                  )}
                </>
              )}
              
              <Link 
                href="/home"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Kembali
              </Link>
            </div>
          </div>

          {/* Stats */}
          {wishlist.length > 0 && (
            <div className="flex gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{wishlist.filter(book => book.stok > 0).length} Tersedia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>{wishlist.filter(book => book.stok === 0).length} Habis</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Wishlist Kosong</h3>
            <p className="text-gray-600 mb-6">Belum ada buku yang ditambahkan ke wishlist</p>
            <Link 
              href="/home"
              className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Jelajahi Buku
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {wishlist.map((book) => (
              <div key={book.wishlist_id || book.id} className="group relative">
                {/* Checkbox for selection */}
                {isSelecting && (
                  <div className="absolute top-2 left-2 z-20">
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book.id)}
                      onChange={() => toggleSelectBook(book.id)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                )}

                {/* Delete button (only show when not selecting) */}
                {!isSelecting && (
                  <button
                    onClick={() => handleRemoveFromWishlist(book.id, book.title)}
                    disabled={loadingRemove[book.id]}
                    className="absolute top-2 right-2 z-20 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:bg-gray-400"
                    title="Hapus dari wishlist"
                  >
                    {loadingRemove[book.id] ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                )}

                <Link href={`/home/detail/${book.id}`}>
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
                    
                    {/* Book Cover */}
                    <div className="relative w-full h-56 bg-gray-100">
                      {book.image ? (
                        <img
                          src={book.image}
                          alt={book.title}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-4xl">
                          📘
                        </div>
                      )}

                      {/* Stock Badge */}
                      <div className="absolute bottom-2 right-2">
                        <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          book.stok > 0 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {book.stok > 0 ? `Stok: ${book.stok}` : 'Habis'}
                        </div>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="p-3 flex-grow flex flex-col">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm leading-snug">
                        {book.title}
                      </h3>
                      
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                        {book.author}
                      </p>

                      <div className="mt-auto pt-2 border-t border-gray-100">
                        <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
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
    </div>
  );
}