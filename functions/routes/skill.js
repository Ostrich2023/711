const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Middleware: Verify token and attach user info
async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) return res.status(401).send("Unauthorized");

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.uid = decoded.uid;

    const userDoc = await admin.firestore().doc(`users/${decoded.uid}`).get();
    if (!userDoc.exists) return res.status(403).send("User document not found");

    req.user = {
      uid: decoded.uid,
      role: userDoc.data().role,
    };
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(403).send("Invalid token");
  }
}

// POST /skill/add
router.post("/add", verifyToken, async (req, res) => {
  const { role, uid } = req.user;
  const { title, description, level } = req.body;

  if (role !== "student") return res.status(403).send("Only students can add skills");

  try {
    const docRef = await admin.firestore().collection("skills").add({
      ownerId: uid,
      title,
      description,
      level,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).send({ id: docRef.id });
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).send("Failed to add skill");
  }
});

// GET /skill/list?uid=[optional]
router.get("/list", verifyToken, async (req, res) => {
  const { uid, role } = req.user;
  const targetUid = req.query.uid || uid;

  // student can only get their own data
  if (role === "student" && targetUid !== uid)
    return res.status(403).send("You can only view your own skills");

  try {
    const snapshot = await admin.firestore()
      .collection("skills")
      .where("ownerId", "==", targetUid)
      .orderBy("createdAt", "desc")
      .get();

    const skills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).send("Failed to fetch skills");
  }
});

// DELETE /skill/delete/:id
router.delete("/delete/:id", verifyToken, async (req, res) => {
  const { role, uid } = req.user;
  const skillId = req.params.id;

  try {
    const docRef = admin.firestore().collection("skills").doc(skillId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return res.status(404).send("Skill not found");

    const skillData = docSnap.data();

    // Allow deletion if student owns it, or if requester is school
    if (skillData.ownerId !== uid && role !== "school") {
      return res.status(403).send("Permission denied");
    }

    await docRef.delete();
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).send("Failed to delete skill");
  }
});

module.exports = router;