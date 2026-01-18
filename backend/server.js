import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import guestsRouter from "./routes/guests.js";
import pkg from "pg";
import "./db.js";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Koneksi ke PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "wedding",
  password: process.env.DB_PASSWORD || "wedding123",
  database: process.env.DB_NAME || "wedding_db",
});

// Buat tabel kalau belum ada
const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS guests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Tabel 'guests' siap digunakan");
  } catch (err) {
    console.error("❌ Gagal membuat tabel:", err);
  }
};

// Jalankan pembuatan tabel di awal
createTable();

app.use("/api/guests", guestsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
