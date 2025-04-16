const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Middleware: verify token and extract user info
async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) return res.status(401).send("Unauthorized");

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const userDoc = await admin.firestore().doc(`users/${decoded.uid}`).get();
    if (!userDoc.exists) return res.status(403).send("User not found");

    const userData = userDoc.data();
    if (userData.role !== "school") {
      return res.status(403).send("Access denied. Only teachers allowed.");
    }

    req.user = {
      uid: decoded.uid,
      role: userData.role,
      schoolId: userData.schoolId,
    };
    next();
  } catch (err) {
    console.error("Token error:", err);
    return res.status(403).send("Invalid token");
  }
}

// GET /school/students (authenticated teacher only)
router.get("/students", verifyToken, async (req, res) => {
  const { schoolId } = req.user;

  try {
    const snapshot = await admin.firestore()
      .collection("users")
      .where("role", "==", "student")
      .where("schoolId", "==", schoolId)
      .get();

    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).send("Failed to retrieve students.");
  }
});

//  GET /school/student/:id/skills (authenticated teacher only)
router.get("/student/:id/skills", verifyToken, async (req, res) => {
  const { schoolId } = req.user;
  const studentId = req.params.id;

  try {
    const studentDoc = await admin.firestore().doc(`users/${studentId}`).get();
    if (!studentDoc.exists) return res.status(404).send("Student not found");

    const student = studentDoc.data();
    if (student.role !== "student" || student.schoolId !== schoolId) {
      return res.status(403).send("Cannot access students from another school.");
    }

    const snapshot = await admin.firestore()
      .collection("skills")
      .where("ownerId", "==", studentId)
      .orderBy("createdAt", "desc")
      .get();

    const skills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(skills);
  } catch (err) {
    console.error("Error fetching student skills:", err);
    res.status(500).send("Failed to retrieve skills.");
  }
});

//  NEW: GET /school/:schoolId/students (public access)
router.get("/:schoolId/students", async (req, res) => {
  const { schoolId } = req.params;

  try {
    const snapshot = await admin.firestore()
      .collection("users")
      .where("role", "==", "student")
      .where("schoolId", "==", schoolId)
      .get();

    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(students);
  } catch (err) {
    console.error("Public school-student fetch failed:", err);
    res.status(500).send("Failed to retrieve students.");
  }
});

module.exports = router;
