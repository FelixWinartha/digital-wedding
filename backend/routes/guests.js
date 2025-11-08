import express from "express";
import pool from "../db.js";

const router = express.Router();

// ✅ Ambil semua tamu
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM guests ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Gagal ambil tamu:", err);
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

// ✅ Tambah tamu baru
router.post("/", async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: "Nama dan pesan wajib diisi" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO guests (name, message, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [name, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Gagal menambah tamu:", err);
    res.status(500).json({ error: "Gagal menyimpan ke database" });
  }
});
// Hapus guest berdasarkan ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM guests WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tamu tidak ditemukan" });
    }

    res.json({ message: "Tamu berhasil dihapus", guest: result.rows[0] });
  } catch (err) {
    console.error("Gagal menghapus tamu:", err);
    res.status(500).json({ error: "Gagal menghapus tamu" });
  }
});

export default router;
