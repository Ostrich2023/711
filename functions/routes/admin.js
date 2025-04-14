const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Middleware: check admin
async function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const docRef = await admin.firestore().doc(`users/${decoded.uid}`).get();
    const userData = docRef.data();
    if (userData.role !== "admin") return res.status(403).send("Forbidden");

    req.user = { uid: decoded.uid };
    next();
  } catch (err) {
    console.error("Admin check failed:", err);
    return res.status(403).send("Invalid token");
  }
}

// GET /admin/users
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

module.exports = router;