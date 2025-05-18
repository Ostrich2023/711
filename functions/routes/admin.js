import express from "express";
import admin from "firebase-admin";
import { verifyAdmin } from "../middlewares/verifyRole.js";

const router = express.Router();

// GET /admin/users — 获取所有用户
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("users").get();
    const allUsers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(allUsers);
  } catch (err) {
    console.error("Failed to load users:", err);
    res.status(500).send("Error retrieving users");
  }
});

export default router;
