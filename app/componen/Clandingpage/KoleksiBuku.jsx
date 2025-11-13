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
        const data = await getBuku(); // ambil data langsung dari actions.js
        setBukuList(data);
      } catch (error) {
        console.error("Error fetch buku:", error);
        setBukuList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBuku();
  }, []);

  const filteredBuku = bukuList.filter((buku) => buku.kategori === kategori);

  return (
    <section className="py-24 px-6 md:px-16 bg-white text-gray-800">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-3 text-blue-700"
        >
          Koleksi Buku Perpustakaan
        </motion.h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Pilih kategori buku yang ingin kamu jelajahi.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {["pelajaran", "umum", "novel"].map((item) => (
          <button
            key={item}
            onClick={() => setKategori(item)}
            className={`px-5 py-2 rounded-full font-medium capitalize transition-all duration-300 ${
              kategori === item
                ? "bg-blue-700 text-white shadow-md"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Buku grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : filteredBuku.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada buku di kategori ini.</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={kategori}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {filteredBuku.map((buku) => (
                <motion.div
                  key={buku.id}
                  whileHover={{ y: -6 }}
                  className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
                >
                  <div className="relative w-full h-52 overflow-hidden">
                    <img
                      src={buku.image || "/books/default.jpg"}
                      alt={buku.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-blue-700 text-sm md:text-base mb-1">{buku.judul}</h3>
                    <p className="text-gray-500 text-xs md:text-sm mb-2">{buku.pengarang}</p>
                    <p className="text-gray-600 text-xs md:text-sm line-clamp-3">{buku.deskripsi}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="text-center mt-14">
        <Link
          href="/koleksi"
          className="px-6 py-3 bg-blue-700 text-white rounded-full font-medium hover:bg-blue-800 transition-all shadow-md"
        >
          Lihat Semua Koleksi
        </Link>
      </div>
    </section>
  );
}
