import express from "express";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

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

// GET /user/protected — Example of protected route
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

export default router;
