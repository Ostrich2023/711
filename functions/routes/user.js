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

// GET /user/:id — 获取任意用户信息（用于展示教师信息）
router.get("/:id", async (req, res) => {
  try {
    const doc = await admin.firestore().doc(`users/${req.params.id}`).get();
    if (!doc.exists) return res.status(404).send("User not found");
    return res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("Failed to fetch user:", err.message);
    res.status(500).send("Failed to fetch user");
  }
});

// PUT /user/update — 更新任意字段（如邮箱、公司类型、公司描述、logoUrl）
router.put("/update", verifyToken, async (req, res) => {
  const { uid } = req.user;
  const { email, companyType, companyDescription, logoUrl } = req.body;

  const updates = {};
  if (email) updates.email = email;
  if (companyType) updates.companyType = companyType;
  if (companyDescription) updates.companyDescription = companyDescription;
  if (logoUrl) updates.logoUrl = logoUrl;

  try {
    await admin.firestore().collection("users").doc(uid).update(updates);
    res.status(200).send("User info updated successfully");
  } catch (error) {
    console.error("Error updating user info:", error.message);
    res.status(500).send("Failed to update user info");
  }
});
export default router;
