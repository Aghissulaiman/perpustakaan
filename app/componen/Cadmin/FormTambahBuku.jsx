"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addBook } from "@/app/lib/actions";

export default function FormTambahBuku({ redirectUrl = "/admin/dashboard/databuku" }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    deskripsi: "",
    stok: "",
    image: "",
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "image") setPreview(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await addBook(new FormData(e.target));
      if (result.success) {
        alert("📚 Buku berhasil ditambahkan!");
        router.push(redirectUrl);
      } else {
        alert("Gagal menambahkan buku: " + result.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="-mt-35 py-16 px-4 md:px-12 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 p-10">
        <h2 className="text-3xl font-bold text-blue-700 mb-10 text-center">
          Tambah Buku Baru 📖
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preview Gambar Besar di Kiri */}
          <div className="flex justify-center items-start md:col-span-1">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-48 h-64 object-cover rounded-xl shadow-md border"
                onError={() => setPreview("")}
              />
            ) : (
              <p className="text-gray-400 text-sm italic text-center">Preview muncul di sini</p>
            )}
          </div>

          {/* Form Input di Kanan */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Judul Buku" name="title" value={formData.title} onChange={handleChange} required />
              <InputField label="Penulis" name="author" value={formData.author} onChange={handleChange} required />
              <SelectField
                label="Kategori"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={["Jurusan", "Umum", "Novel"]}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextAreaField label="Deskripsi" name="deskripsi" value={formData.deskripsi} onChange={handleChange} />
              <InputField label="Stok" name="stok" type="number" value={formData.stok} onChange={handleChange} required />
              <InputField
                label="URL Gambar"
                name="image"
                type="url"
                placeholder="https://example.com/book.jpg"
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 h-14 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition"
              >
                Batal
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

// ===================
// COMPONENTS
// ===================
function InputField({ label, name, type = "text", required, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-700 font-medium">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-14 p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base"
      />
    </div>
  );
}

function TextAreaField({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-2 md:col-span-2">
      <label className="text-gray-700 font-medium">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows="5"
        className="h-32 p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-700 font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="h-14 p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base"
      >
        <option value="">Pilih kategori...</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
