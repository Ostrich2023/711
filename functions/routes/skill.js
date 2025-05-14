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
    if (!userDoc.exists) return res.status(403).send("User not found");

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
  const { courseId, attachmentCid, level, softSkills } = req.body;

  if (role !== "student") return res.status(403).send("Only students can add skills");
  if (!courseId) return res.status(400).send("Missing courseId");

  if (!Array.isArray(softSkills) || softSkills.length === 0 || softSkills.length > 5) {
    return res.status(400).send("Please select 1 to 5 soft skills");
  }

  try {
    const courseRef = admin.firestore().doc(`courses/${courseId}`);
    const courseDoc = await courseRef.get();
    if (!courseDoc.exists) return res.status(404).send("Course not found");

    const courseData = courseDoc.data();
    const skillTemplate = courseData.skillTemplate || {};

    const existingSnap = await admin.firestore()
      .collection("skills")
      .where("courseId", "==", courseId)
      .where("ownerId", "==", uid)
      .get();

    const isFirstSubmission = existingSnap.empty;

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
      softSkills, // array of soft-skill ID
      hardSkillScores: null,
      softSkillScores: null,
      verified: "pending",
      reviewedBy: null,
      reviewedAt: null,
      note: "",
      score: null,
      createdAt: FieldValue ? FieldValue.serverTimestamp() : new Date().toISOString(),
    });

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

// GET /skill/list — enhanced: resolve softSkill names and major
router.get("/list", verifyToken, async (req, res) => {
  const { uid, role } = req.user;
  if (role !== "student") return res.status(403).send("Only students can view their skills");

  try {
    const db = admin.firestore();
    const userDoc = await db.doc(`users/${uid}`).get();
    const studentMajorId = userDoc.data()?.major;

    const majorDoc = await db.doc(`majors/${studentMajorId}`).get();
    const majorName = majorDoc.exists ? majorDoc.data().name : null;

    const skillSnap = await db
      .collection("skills")
      .where("ownerId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const softSkillDocs = await db.collection("soft-skills").get();
    const softSkillMap = {};
    softSkillDocs.forEach((doc) => {
      softSkillMap[doc.id] = doc.data().name;
    });

    const results = skillSnap.docs.map((doc) => {
      const data = doc.data();
      const resolvedSoftSkills = (data.softSkills || []).map((id) => softSkillMap[id] || id);
      return {
        id: doc.id,
        ...data,
        softSkills: resolvedSoftSkills,
        major: majorName,
      };
    });

    res.json(results);
  } catch (error) {
    console.error("Failed to fetch skills:", error.message);
    res.status(500).send("Failed to load skills");
  }
});

// PUT /skill/review/:id — 教师评分技能
router.put("/review/:id", verifyToken, async (req, res) => {
  const { role, uid } = req.user;
  const skillId = req.params.id;
  const { hardSkillScores, softSkillScores, note } = req.body;

  if (role !== "school") {
    return res.status(403).send("Only teachers can review skills");
  }

  if (
    typeof hardSkillScores !== "object" ||
    typeof softSkillScores !== "object"
  ) {
    return res.status(400).send("Missing or invalid rubric score structure");
  }

  try {
    const skillRef = admin.firestore().doc(`skills/${skillId}`);
    const skillDoc = await skillRef.get();

    if (!skillDoc.exists) return res.status(404).send("Skill not found");

    await skillRef.update({
      hardSkillScores,
      softSkillScores,
      note: note || "",
      verified: "approved",
      reviewedBy: uid,
      reviewedAt: FieldValue.serverTimestamp(),
    });

    res.send("Skill reviewed successfully");
  } catch (error) {
    console.error("Skill review failed:", error.message);
    res.status(500).send("Failed to review skill");
  }
});

export default router;
