// functions/routes/user.js

const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

const { create } = require("ipfs-http-client");
const upload = require("../middlewares/upload");

// POST /user/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 使用 Firebase Client SDK 验证登录（你需在客户端完成，这里仅模拟成功验证）
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    // 获取角色信息
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User role not found." });
    }

    const { role } = userDoc.data();

    // 创建自定义 JWT token
    const token = jwt.sign(
      { uid, role, email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "2h" }
    );

    res.json({ token, role });
  } catch (err) {
    console.error("Login failed:", err.message);
    res.status(401).json({ error: "Invalid credentials or user not found." });
  }
});

// init IPFS (Infura)
const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });

// upload api
router.post("/upload-skill", verifyToken, upload.single("file"), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    try {
        const added = await client.add(file.buffer);
        const ipfsHash = added.path;

        res.status(200).json({ success: true, hash: ipfsHash });
    } catch (err) {
        console.error("IPFS upload error:", err);
        res.status(500).json({ success: false, message: "Failed to upload to IPFS" });
    }
});

module.exports = router;


const verifyToken = require("../middlewares/verifyToken");

router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});
