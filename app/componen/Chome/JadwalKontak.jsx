"use client";

import { FaClock, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaInstagram } from "react-icons/fa";

export default function JadwalKontak() {
  return (
    <section
      id="jadwal"
      className="py-20 px-6 md:px-16 bg-gradient-to-b from-white to-blue-50 border-t border-gray-100"
    >
      {/* Judul */}
      <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 mb-12 text-left border-l-4 border-blue-500 pl-4">
        Jadwal & Kontak Perpustakaan
      </h2>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* === Jadwal === */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <FaClock className="text-blue-600 text-2xl" />
            <h3 className="text-xl font-semibold text-blue-700">
              Jadwal Layanan
            </h3>
          </div>

          <ul className="space-y-2 text-gray-700">
            <li>
              <span className="font-medium">Senin – Jumat:</span> 07.00 - 16.00
            </li>
            <li>
              <span className="font-medium">Sabtu:</span> 08.00 - 12.00
            </li>
            <li>
              <span className="font-medium">Minggu & Libur Nasional:</span>{" "}
              Tutup
            </li>
          </ul>

          <div className="mt-6 bg-blue-50 p-4 rounded-xl text-sm text-gray-600 border border-blue-100">
            📚 Mohon datang sesuai jam operasional.<br />
            Buku dapat dipinjam dan dikembalikan di meja layanan utama.
          </div>
        </div>

        {/* === Kontak === */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <FaMapMarkerAlt className="text-blue-600 text-2xl" />
            <h3 className="text-xl font-semibold text-blue-700">
              Kontak Kami
            </h3>
          </div>

          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-blue-500 mt-1" />
              <span>
                <span className="font-medium">Alamat:</span><br />
                Jl. Raya Pekapuran No.45, Depok, Jawa Barat
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaEnvelope className="text-blue-500 mt-1" />
              <span>
                <span className="font-medium">Email:</span><br />
                perpustakaan@smktarunabhakti.sch.id
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaPhoneAlt className="text-blue-500 mt-1" />
              <span>
                <span className="font-medium">Telepon:</span><br />
                (021) 7721 4567
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaInstagram className="text-blue-500 mt-1" />
              <span>
                <span className="font-medium">Instagram:</span><br />
                <a
                  href="https://www.instagram.com/smktarunabhakti/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  @smktarunabhakti
                </a>
              </span>
            </li>
          </ul>

          <div className="mt-6 text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-xl p-4">
            📍 Gedung 2 Lantai 3 — SMK Taruna Bhakti Depok
          </div>
        </div>
      </div>
    </section>
  );
}
