import express from "express";
import axios from "axios";
import { Pool } from "pg";

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

//read and download files from IPFS servers via USERID 
router.get("/file/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { rows } = await pool.query(
      "SELECT ipfs_cid FROM users WHERE id = $1",
      [userId]
    );
    if (!rows.length || !rows[0].ipfs_cid) {
      return res.status(404).send("No file CID found");
    }
    const cid = rows[0].ipfs_cid;
    //get CID based on port https://ipfs.io/ipfs/<CID>
    const ipfsUrl = `https://ipfs.io/ipfs/${cid}`;
    const response = await axios.get(ipfsUrl, { responseType: "arraybuffer" });
    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
