"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getBuku } from "@/app/lib/actions";

export default function KoleksiBuku() {
  const [kategori, setKategori] = useState("pelajaran");
  const [bukuList, setBukuList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuku = async () => {
      setLoading(true);
      try {
        const data = await getBuku();
        setBukuList(data);
      } catch (error) {
        console.error("Error fetch buku:", error);
      }
      setLoading(false);
    };
    fetchBuku();
  }, []);

  const filteredBuku = bukuList.filter((b) => b.kategori === kategori);

  return (
    <section className="py-24 px-6 md:px-16 bg-gradient-to-br from-white to-blue-50 text-gray-800">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold mb-3 text-blue-700"
        >
          Koleksi Buku Perpustakaan
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-500 max-w-2xl mx-auto"
        >
          Pilih kategori dan jelajahi berbagai koleksi kami.
        </motion.p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        {["pelajaran", "umum", "novel"].map((item) => {
          const active = kategori === item;
          return (
            <motion.button
              key={item}
              onClick={() => setKategori(item)}
              whileTap={{ scale: 0.9 }}
              className={`px-6 py-2.5 rounded-full font-medium capitalize transition-all duration-300 shadow-sm
              ${
                active
                  ? "bg-blue-700 text-white shadow-lg scale-105"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              {item}
            </motion.button>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : filteredBuku.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada buku di kategori ini.</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={kategori}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.45 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {filteredBuku.map((buku) => (
                <motion.div
                  key={buku.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-blue-100/50 backdrop-blur-sm"
                >
                  <div className="relative w-full h-56 overflow-hidden rounded-t-3xl">
                    <motion.img
                      src={buku.image || "/books/default.jpg"}
                      alt={buku.judul}
                      className="w-full h-full object-cover transition-transform duration-700"
                      whileHover={{ scale: 1.15 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 bg-blue-600/90 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">
                      {buku.kategori}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-blue-800 text-base md:text-lg mb-2 line-clamp-2 leading-tight">
                      {buku.judul}
                    </h3>
                    <p className="text-blue-600 text-sm md:text-base mb-3 font-medium">{buku.pengarang}</p>
                    <p className="text-gray-600 text-sm md:text-sm line-clamp-3 leading-relaxed">
                      {buku.deskripsi}
                    </p>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Buku</span>
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                          Tersedia
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="text-center mt-14">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            href="/login"
            className="px-7 py-3 bg-blue-700 text-white rounded-full font-medium hover:bg-blue-800 transition-all shadow-lg"
          >
            Lihat Semua Koleksi
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
