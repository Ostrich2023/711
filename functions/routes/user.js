const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

const verifyToken = require("../middlewares/verifyToken");

// POST /user/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User role not found." });
    }

    const { role } = userDoc.data();

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

// 示例受保护接口
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

module.exports = router;
