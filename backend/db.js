import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "wedding",
  password: process.env.DB_PASSWORD || "wedding123",
  database: process.env.DB_NAME || "wedding_db",
});

const connectWithRetry = async (retries = 10, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query("SELECT 1");
      console.log("✅ Database connected!");
      return;
    } catch (err) {
      console.log(`Database belum siap... mencoba lagi (${i + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  console.error("Tidak bisa terhubung ke database setelah beberapa kali percobaan.");
  process.exit(1);
};

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS guests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Tabel 'guests' siap digunakan!");
  } catch (err) {
    console.error(" Gagal membuat tabel:", err);
  }
};


(async () => {
  await connectWithRetry();
  await initDB();
})();

export default pool;
