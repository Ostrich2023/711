import express from "express";
import admin from "firebase-admin";

const router = express.Router();
const FieldValue = admin.firestore?.FieldValue ?? null;

// Middleware: Verify token and attach user info
async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) return res.status(401).send("Unauthorized");

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
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

// POST /skill/add — Add a new skill (student only)
router.post("/add", verifyToken, async (req, res) => {
  const { role, uid } = req.user;
  const { courseId, attachmentCid, level } = req.body;

  if (role !== "student") return res.status(403).send("Only students can add skills");
  if (!courseId) return res.status(400).send("Missing courseId");

  try {
    // 获取课程数据
    const courseRef = admin.firestore().doc(`courses/${courseId}`);
    const courseDoc = await courseRef.get();
    if (!courseDoc.exists) return res.status(404).send("Course not found");

    const courseData = courseDoc.data();
    const skillTemplate = courseData.skillTemplate || {};

    // 是否首次提交
    const existingSnap = await admin.firestore()
      .collection("skills")
      .where("courseId", "==", courseId)
      .where("ownerId", "==", uid)
      .get();

    const isFirstSubmission = existingSnap.empty;

    // 添加技能
    const docRef = await admin.firestore().collection("skills").add({
      ownerId: uid,
      courseId,
      courseCode: courseData.code || "",
      courseTitle: courseData.title || "",
      schoolId: courseData.schoolId || "",
      title: skillTemplate.skillTitle || "",
      description: skillTemplate.skillDescription || "",
      level: level || "Beginner",
      attachmentCid: attachmentCid || "",
      verified: "pending",
      reviewedBy: null,
      reviewedAt: null,
      note: "",
      score: null,
      createdAt: FieldValue ? FieldValue.serverTimestamp() : new Date().toISOString(),
    });

    // 首次提交则更新 studentCount
    if (isFirstSubmission) {
      await courseRef.update({
        studentCount: FieldValue.increment(1),
      });
    }

    res.status(201).send({ id: docRef.id });
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).send("Failed to add skill");
  }
});

// GET /skill/list — 学生查看自己提交的所有技能
router.get("/list", verifyToken, async (req, res) => {
  const { uid, role } = req.user;

  if (role !== "student") {
    return res.status(403).send("Only students can view their own skills");
  }

  try {
    const snapshot = await admin.firestore()
      .collection("skills")
      .where("ownerId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const skills = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(skills);
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    res.status(500).send("Failed to load skills");
  }
});

export default router;
