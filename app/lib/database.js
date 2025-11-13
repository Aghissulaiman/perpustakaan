import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "aghis-gm_97531",
  database: "db_projek_perpustakaan",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
export default pool;