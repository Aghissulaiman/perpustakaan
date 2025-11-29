"use client";

import { useState, useEffect } from "react";
import { getAllUsers, createUser, updateUser, deleteUser } from "@/app/lib/actions";

export default function DataAnggota() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" or "edit"
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "", email: "", password: "", role: "siswa", 
    nis: "", kelas: "", jurusan: "", nip: "", mapel: ""
  });

  const kelasOptions = ["10", "11", "12"];
  const jurusanOptions = ["IPA", "IPS", "Bahasa"];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, selectedKelas, selectedJurusan]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;
    if (selectedKelas) filtered = filtered.filter(user => user.kelas === selectedKelas);
    if (selectedJurusan) filtered = filtered.filter(user => user.jurusan === selectedJurusan);
    setFilteredUsers(filtered);
  };

  // Modal handlers
  const openAddModal = () => {
    setModalType("add");
    setFormData({ username: "", email: "", password: "", role: "siswa", nis: "", kelas: "", jurusan: "", nip: "", mapel: "" });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalType("edit");
    setSelectedUser(user);
    setFormData({
      username: user.username, email: user.email, password: "", role: user.role,
      nis: user.nis || "", kelas: user.kelas || "", jurusan: user.jurusan || "", 
      nip: user.nip || "", mapel: user.mapel || ""
    });
    setShowModal(true);
  };

  const openDeleteModal = (user) => {
    if (confirm(`Hapus anggota ${user.username}?`)) {
      handleDelete(user.id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === "add") {
        await createUser(formData);
      } else {
        await updateUser(selectedUser.id, formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Memuat data anggota...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Anggota</h1>
          <p className="text-gray-600">Kelola data anggota perpustakaan</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            {filteredUsers.length} Anggota
          </div>
          <button onClick={openAddModal} className="bg-green-600 text-white px-4 py-2 rounded-lg">
            + Tambah
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-4">
          <select 
            value={selectedKelas} 
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Semua Kelas</option>
            {kelasOptions.map(k => <option key={k} value={k}>Kelas {k}</option>)}
          </select>
          
          <select 
            value={selectedJurusan} 
            onChange={(e) => setSelectedJurusan(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Semua Jurusan</option>
            {jurusanOptions.map(j => <option key={j} value={j}>{j}</option>)}
          </select>

          <button 
            onClick={() => { setSelectedKelas(""); setSelectedJurusan(""); }}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold">{user.username}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Role:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  user.role === 'admin' ? 'bg-red-100 text-red-700' :
                  user.role === 'guru' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {user.role}
                </span>
              </div>
              {user.kelas && <div className="flex justify-between"><span>Kelas:</span> <span>{user.kelas}</span></div>}
              {user.jurusan && <div className="flex justify-between"><span>Jurusan:</span> <span>{user.jurusan}</span></div>}
              {user.nis && <div className="flex justify-between"><span>NIS:</span> <span>{user.nis}</span></div>}
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => openEditModal(user)}
                className="flex-1 bg-blue-600 text-white py-1 rounded text-sm"
              >
                Edit
              </button>
              <button 
                onClick={() => openDeleteModal(user)}
                className="flex-1 bg-red-600 text-white py-1 rounded text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">
                {modalType === "add" ? "Tambah Anggota" : "Edit Anggota"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="password"
                placeholder={modalType === "add" ? "Password" : "Password (kosongkan jika tidak diubah)"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full border p-2 rounded"
                required={modalType === "add"}
              />
              
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full border p-2 rounded"
              >
                <option value="siswa">Siswa</option>
                <option value="guru">Guru</option>
                <option value="admin">Admin</option>
              </select>

              {formData.role === "siswa" && (
                <>
                  <input
                    type="text"
                    placeholder="NIS"
                    value={formData.nis}
                    onChange={(e) => setFormData({...formData, nis: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                  <select
                    value={formData.kelas}
                    onChange={(e) => setFormData({...formData, kelas: e.target.value})}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Pilih Kelas</option>
                    {kelasOptions.map(k => <option key={k} value={k}>Kelas {k}</option>)}
                  </select>
                  <select
                    value={formData.jurusan}
                    onChange={(e) => setFormData({...formData, jurusan: e.target.value})}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Pilih Jurusan</option>
                    {jurusanOptions.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </>
              )}

              {formData.role === "guru" && (
                <>
                  <input
                    type="text"
                    placeholder="NIP"
                    value={formData.nip}
                    onChange={(e) => setFormData({...formData, nip: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Mata Pelajaran"
                    value={formData.mapel}
                    onChange={(e) => setFormData({...formData, mapel: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded"
                >
                  {modalType === "add" ? "Tambah" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}