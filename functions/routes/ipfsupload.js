import express from "express";
import { create } from "ipfs-http-client";
import { Pool } from "pg";

const router = express.Router();

//initialization ipfs server
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});

//link to sql
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

//upload files and return CID back after
router.post("/upload", async (req, res) => {
  try {
    const file = req.file.buffer;
    //upload
    const result = await ipfs.add(file);
    const cid = result.path;

    //get cid
    const userId = req.body.userId;
    await pool.query(
      "UPDATE users SET ipfs_cid = $1 WHERE id = $2",
      [cid, userId]
    );

    res.json({ success: true, cid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
