import { NextResponse } from "next/server";
import pool from "@/app/lib/database";

export async function GET() {
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

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}