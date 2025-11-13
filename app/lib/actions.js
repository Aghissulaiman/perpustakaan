
"use server";

import bcrypt from "bcryptjs";
import pool from "./database"; // ✅ Pool koneksi MySQL

// ================= REGISTER USER =================
export async function registerUser(formData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  const nis = formData.get("nis") || null;
  const kelas = formData.get("kelas") || null;
  const nip = formData.get("nip") || null;
  const mapel = formData.get("mapel") || null;

  const hashedPassword = bcrypt.hashSync(password, 10);

  await pool.execute(
    `INSERT INTO users (username, email, password, role, nis, kelas, nip, mapel)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [username, email, hashedPassword, role, nis, kelas, nip, mapel]
  );

  return { message: "Register berhasil" };
}

// ================= LOGIN USER =================
export async function loginUser(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
  if (!rows.length) throw new Error("Email tidak terdaftar");

  const user = rows[0];
  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) throw new Error("Password salah");

  const { password: _, ...userData } = user;
  return userData;
}

// ================= GET BUKU =================
export async function getBuku() {
  try {
    const [rows] = await pool.execute("SELECT * FROM buku ORDER BY id ASC");
    return rows;
  } catch (error) {
    console.error("Failed to fetch buku:", error);
    return [];
  }
}

// ================= GET KOLEKSI BUKU =================
export async function getKoleksiBuku() {
  try {
    const [rows] = await pool.execute("SELECT * FROM koleksi_buku ORDER BY id ASC");
    return rows;
  } catch (error) {
    console.error("Failed to fetch koleksi_buku:", error);
    return [];
  }
}

// ================= GET USER DATA =================
export async function getUserData(userId) {
  try {
    const [rows] = await pool.execute(
      "SELECT id, username, email, role, nis, kelas, nip, mapel FROM users WHERE id = ?",
      [userId]
    );
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}

// ================= PROSES PEMINJAMAN =================
export async function pinjamBuku(formData) {
  const user_id = parseInt(formData.get("user_id"));
  const buku_id = parseInt(formData.get("buku_id"));
  const jumlah = parseInt(formData.get("jumlah"));
  const tanggal_kembali = formData.get("tanggal_kembali");

  if (jumlah !== 1) {
    return { error: "Hanya bisa meminjam 1 buku per transaksi." };
  }
  if (!tanggal_kembali) {
    return { error: "Tanggal pengembalian wajib diisi." };
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [bookRows] = await conn.execute("SELECT stok FROM koleksi_buku WHERE id = ?", [buku_id]);
    if (!bookRows.length) throw new Error("Buku tidak ditemukan.");
    if (bookRows[0].stok < jumlah) throw new Error("Stok buku tidak mencukupi.");

    // ❗ STATUS default: menunggu konfirmasi (belum kurangi stok)
    await conn.execute(
      `INSERT INTO peminjaman (user_id, buku_id, jumlah, status, tanggal_kembali)
       VALUES (?, ?, ?, 'menunggu konfirmasi', ?)`,
      [user_id, buku_id, jumlah, tanggal_kembali]
    );

    await conn.commit();
    return { success: "Permintaan peminjaman dikirim. Menunggu konfirmasi admin." };
  } catch (error) {
    await conn.rollback();
    console.error("Gagal meminjam:", error);
    return { error: error.message };
  } finally {
    conn.release();
  }
}


// ================= GET HISTORY PEMINJAMAN =================
export async function getHistoryPeminjaman(userId) {
  try {
    const [rows] = await pool.execute(
      `SELECT 
         p.id,
         b.title AS judul,
         b.author AS penulis,
         b.category AS kategori,
         p.jumlah,
         p.tanggal_pinjam,
         p.tanggal_kembali,
         p.status
       FROM peminjaman p
       JOIN koleksi_buku b ON p.buku_id = b.id
       WHERE p.user_id = ?
       ORDER BY p.tanggal_pinjam DESC`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Gagal ambil history:", error);
    return [];
  }
}

// ================= UPDATE STATUS PEMINJAMAN (ADMIN) =================
export async function updateStatusPeminjaman(id, status) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.execute(
      "SELECT buku_id, jumlah, status FROM peminjaman WHERE id = ?",
      [id]
    );
    if (!rows.length) throw new Error("Data peminjaman tidak ditemukan");

    const { buku_id, jumlah, status: oldStatus } = rows[0];

    // ✅ Admin konfirmasi (ubah ke dipinjam)
    if (status === "dipinjam" && oldStatus === "menunggu konfirmasi") {
      await conn.execute("UPDATE koleksi_buku SET stok = stok - ? WHERE id = ?", [jumlah, buku_id]);
    }

    // ✅ Jika buku dikembalikan, stok ditambah lagi
    if (status === "dikembalikan" && oldStatus === "dipinjam") {
      await conn.execute("UPDATE koleksi_buku SET stok = stok + ? WHERE id = ?", [jumlah, buku_id]);
    }

    // 🔄 Update status
    await conn.execute("UPDATE peminjaman SET status = ? WHERE id = ?", [status, id]);
    await conn.commit();

    return { success: `Status peminjaman berhasil diubah menjadi '${status}'.` };
  } catch (error) {
    await conn.rollback();
    console.error("Gagal update status:", error);
    return { error: error.message };
  } finally {
    conn.release();
  }
}


// ================= ADMIN CRUD KOLEKSI BUKU =================

// CREATE
export async function addBook(formData) {
  const title = formData.get("title");
  const author = formData.get("author");
  const category = formData.get("category");
  const deskripsi = formData.get("deskripsi") || null;
  const stok = parseInt(formData.get("stok")) || 0;
  const image = formData.get("image") || null;

  await pool.execute(
    `INSERT INTO koleksi_buku (title, author, category, deskripsi, stok, image)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, author, category, deskripsi, stok, image]
  );

  return { success: "Buku baru berhasil ditambahkan!" };
}

// READ
export async function getAllBooks() {
  const [rows] = await pool.execute("SELECT * FROM koleksi_buku ORDER BY id DESC");
  return rows;
}

// UPDATE
export async function updateBook(formData) {
  const id = formData.get("id");
  const title = formData.get("title");
  const author = formData.get("author");
  const category = formData.get("category");
  const deskripsi = formData.get("deskripsi") || null;
  const stok = parseInt(formData.get("stok")) || 0;
  const image = formData.get("image") || null;

  await pool.execute(
    `UPDATE koleksi_buku 
     SET title=?, author=?, category=?, deskripsi=?, stok=?, image=? 
     WHERE id=?`,
    [title, author, category, deskripsi, stok, image, id]
  );

  return { success: "Data buku berhasil diperbarui!" };
}

// DELETE
export async function deleteBook(bookId) {
  await pool.execute("DELETE FROM koleksi_buku WHERE id = ?", [bookId]);
  return { success: "Buku berhasil dihapus!" };
}

// DELETE PEMINJAMAN
export async function deletePeminjaman(id) {
  await pool.execute("DELETE FROM peminjaman WHERE id = ?", [id]);
  return { success: "Data peminjaman berhasil dihapus!" };
}

// ================= GET SEMUA PEMINJAMAN (ADMIN) =================
export async function getAllPeminjaman() {
  try {
    const [rows] = await pool.execute(
      `SELECT 
         p.id,
         u.username,
         u.nis,
         b.title AS judul_buku,
         p.jumlah,
         p.tanggal_pinjam,
         p.tanggal_kembali,
         p.status
       FROM peminjaman p
       JOIN users u ON p.user_id = u.id
       JOIN koleksi_buku b ON p.buku_id = b.id
       ORDER BY p.tanggal_pinjam DESC`
    );
    return rows;
  } catch (error) {
    console.error("Gagal ambil data peminjaman:", error);
    return [];
  }
}
