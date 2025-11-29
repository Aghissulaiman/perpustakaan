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
  const jurusan = formData.get("jurusan") || null;
  const nip = formData.get("nip") || null;
  const mapel = formData.get("mapel") || null;

  const hashedPassword = bcrypt.hashSync(password, 10);

  await pool.execute(
    `INSERT INTO users (username, email, password, role, nis, kelas, jurusan, nip, mapel)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [username, email, hashedPassword, role, nis, kelas, jurusan, nip, mapel]
  );
  const [checkEmail] = await pool.execute(
  "SELECT id FROM users WHERE email = ?",
  [email]
);
if (checkEmail.length) {
  throw new Error("Email sudah digunakan!");
}


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
  if (!userId || isNaN(parseInt(userId))) {
    console.error("UserId tidak valid:", userId);
    return null;
  }

  try {
    const [rows] = await pool.execute(
      "SELECT id, username, email, role, nis, kelas, jurusan, nip, mapel FROM users WHERE id = ?",
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
         b.image AS gambar,
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
  const isbn = formData.get("isbn") || null;

  await pool.execute(
    `INSERT INTO koleksi_buku (title, author, category, deskripsi, stok, image, isbn)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, author, category, deskripsi, stok, image, isbn]
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
  const isbn = formData.get("isbn") || null;

  await pool.execute(
    `UPDATE koleksi_buku
     SET title=?, author=?, category=?, deskripsi=?, stok=?, image=?, isbn=?
     WHERE id=?`,
    [title, author, category, deskripsi, stok, image, isbn, id]
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

// GET BOOK BY ID
export async function getBookById(id) {
  try {
    const [rows] = await pool.execute("SELECT * FROM koleksi_buku WHERE id = ?", [id]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error("Failed to fetch book by id:", error);
    return null;
  }
}

// CHECK ACTIVE LOANS FOR USER
export async function checkActiveLoans(userId) {
  try {
    const [rows] = await pool.execute(
      "SELECT id, buku_id FROM peminjaman WHERE user_id = ? AND status != 'dikembalikan'",
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Failed to check active loans:", error);
    return [];
  }
}

// ================= GET ALL USERS =================
export async function getAllUsers() {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        id, 
        username, 
        email, 
        role, 
        nis, 
        kelas, 
        jurusan, 
        nip, 
        mapel,
        created_at
       FROM users 
       ORDER BY 
        CASE WHEN kelas IS NULL THEN 1 ELSE 0 END,
        kelas,
        jurusan,
        username`
    );
    return rows;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

// ================= CREATE USER (For Admin) =================
export async function createUser(userData) {
  const { username, email, password, role, nis, kelas, jurusan, nip, mapel } = userData;

  try {
    // Check if email already exists
    const [checkEmail] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (checkEmail.length) {
      throw new Error("Email sudah digunakan!");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await pool.execute(
      `INSERT INTO users (username, email, password, role, nis, kelas, jurusan, nip, mapel)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, role, nis, kelas, jurusan, nip, mapel]
    );

    return { success: "Anggota berhasil ditambahkan!" };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(error.message || "Gagal menambahkan anggota");
  }
}

// ================= UPDATE USER =================
export async function updateUser(userId, userData) {
  const { username, email, password, role, nis, kelas, jurusan, nip, mapel } = userData;

  try {
    // Check if email already exists (excluding current user)
    const [checkEmail] = await pool.execute(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, userId]
    );
    if (checkEmail.length) {
      throw new Error("Email sudah digunakan!");
    }

    let query = `UPDATE users SET username=?, email=?, role=?, nis=?, kelas=?, jurusan=?, nip=?, mapel=?`;
    let values = [username, email, role, nis, kelas, jurusan, nip, mapel];

    // Jika password diisi, update password juga
    if (password && password.trim() !== "") {
      const hashedPassword = bcrypt.hashSync(password, 10);
      query += `, password=?`;
      values.push(hashedPassword);
    }

    query += ` WHERE id=?`;
    values.push(userId);

    await pool.execute(query, values);

    return { success: "Data anggota berhasil diperbarui!" };
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error(error.message || "Gagal memperbarui data anggota");
  }
}

// ================= DELETE USER =================
export async function deleteUser(userId) {
  try {
    // Check if user exists
    const [user] = await pool.execute("SELECT id FROM users WHERE id = ?", [userId]);
    if (!user.length) {
      throw new Error("Anggota tidak ditemukan!");
    }

    // Check if user has active loans
    const [activeLoans] = await pool.execute(
      "SELECT id FROM peminjaman WHERE user_id = ? AND status != 'dikembalikan'",
      [userId]
    );
    
    if (activeLoans.length > 0) {
      throw new Error("Tidak dapat menghapus anggota yang masih memiliki peminjaman aktif!");
    }

    await pool.execute("DELETE FROM users WHERE id = ?", [userId]);

    return { success: "Anggota berhasil dihapus!" };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error(error.message || "Gagal menghapus anggota");
  }
}

// ================= GET USER BY ID =================
export async function getUserById(userId) {
  try {
    const [rows] = await pool.execute(
      "SELECT id, username, email, role, nis, kelas, jurusan, nip, mapel FROM users WHERE id = ?",
      [userId]
    );
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error("Failed to fetch user by id:", error);
    return null;
  }
}

// ================= WISHLIST FUNCTIONS =================

// ADD TO WISHLIST
export async function addToWishlist(userId, bukuId) {
  if (!userId || !bukuId) {
    throw new Error("User ID dan Book ID diperlukan");
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Check if book exists
    const [book] = await conn.execute("SELECT id, title FROM koleksi_buku WHERE id = ?", [bukuId]);
    if (!book.length) {
      throw new Error("Buku tidak ditemukan!");
    }

    // Check if already in wishlist
    const [existing] = await conn.execute(
      "SELECT id FROM wishlist WHERE user_id = ? AND buku_id = ?",
      [userId, bukuId]
    );

    if (existing.length) {
      throw new Error(`Buku "${book[0].title}" sudah ada di wishlist!`);
    }

    // Add to wishlist
    await conn.execute(
      "INSERT INTO wishlist (user_id, buku_id) VALUES (?, ?)",
      [userId, bukuId]
    );

    await conn.commit();
    return { success: `Buku "${book[0].title}" berhasil ditambahkan ke wishlist!` };
  } catch (error) {
    await conn.rollback();
    
    // Handle duplicate entry error (MySQL error code 1062)
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error("Buku sudah ada di wishlist!");
    }
    
    console.error("Error adding to wishlist:", error);
    throw new Error(error.message || "Gagal menambahkan ke wishlist");
  } finally {
    conn.release();
  }
}

// REMOVE FROM WISHLIST
export async function removeFromWishlist(userId, bukuId) {
  if (!userId || !bukuId) {
    throw new Error("User ID dan Book ID diperlukan");
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Get book title for message
    const [book] = await conn.execute("SELECT title FROM koleksi_buku WHERE id = ?", [bukuId]);
    const bookTitle = book.length ? book[0].title : "Buku";

    const [result] = await conn.execute(
      "DELETE FROM wishlist WHERE user_id = ? AND buku_id = ?",
      [userId, bukuId]
    );

    if (result.affectedRows === 0) {
      throw new Error("Buku tidak ditemukan di wishlist!");
    }

    await conn.commit();
    return { success: `"${bookTitle}" berhasil dihapus dari wishlist!` };
  } catch (error) {
    await conn.rollback();
    console.error("Error removing from wishlist:", error);
    throw new Error(error.message || "Gagal menghapus dari wishlist");
  } finally {
    conn.release();
  }
}

// GET USER WISHLIST
export async function getUserWishlist(userId) {
  if (!userId) {
    return [];
  }

  try {
    const [rows] = await pool.execute(
      `SELECT 
         w.id as wishlist_id,
         b.id,
         b.title,
         b.author,
         b.category,
         b.deskripsi,
         b.stok,
         b.image,
         b.isbn,
         w.created_at
       FROM wishlist w
       JOIN koleksi_buku b ON w.buku_id = b.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
}

// CHECK IF BOOK IN WISHLIST
export async function isBookInWishlist(userId, bukuId) {
  if (!userId || !bukuId) {
    return false;
  }

  try {
    const [rows] = await pool.execute(
      "SELECT id FROM wishlist WHERE user_id = ? AND buku_id = ?",
      [userId, bukuId]
    );
    return rows.length > 0;
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return false;
  }
}

// GET WISHLIST COUNT
export async function getWishlistCount(userId) {
  if (!userId) {
    return 0;
  }

  try {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?",
      [userId]
    );
    return parseInt(rows[0].count);
  } catch (error) {
    console.error("Error getting wishlist count:", error);
    return 0;
  }
}

// CLEAR USER WISHLIST
export async function clearWishlist(userId) {
  if (!userId) {
    throw new Error("User ID diperlukan");
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.execute(
      "DELETE FROM wishlist WHERE user_id = ?",
      [userId]
    );

    await conn.commit();
    return { success: `Berhasil menghapus ${result.affectedRows} buku dari wishlist!` };
  } catch (error) {
    await conn.rollback();
    console.error("Error clearing wishlist:", error);
    throw new Error(error.message || "Gagal membersihkan wishlist");
  } finally {
    conn.release();
  }
}