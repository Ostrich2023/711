import express from "express";
import admin from "firebase-admin";

const router = express.Router();

// Middleware: verify teacher
async function verifyTeacher(req, res, next) {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) return res.status(401).send("Unauthorized");

    try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        const uid = decoded.uid;

        const userDoc = await admin.firestore().doc(`users/${uid}`).get();
        if (!userDoc.exists) return res.status(403).send("User not found");

        const user = userDoc.data();
        if (user.role !== "school") {
            return res.status(403).send("Access denied. Only teachers allowed.");
        }

        req.user = { uid, ...user };
        next();
    } catch (err) {
        console.error("Teacher token verification failed:", err);
        return res.status(403).send("Invalid token");
    }
}

// GET /teacher/me
router.get("/me", verifyTeacher, (req, res) => {
    const { uid, email, schoolId, name } = req.user;
    res.json({ uid, email, name, schoolId, role: "teacher" });
});

// POST /teacher/verify-skill/:id — 支持 approved/rejected 三状态验证
router.post("/verify-skill/:id", verifyTeacher, async (req, res) => {
  const skillId = req.params.id;
  const { score, decision, note } = req.body;

  // 校验状态值
  if (!["approved", "rejected"].includes(decision)) {
    return res.status(400).send("Invalid decision. Must be 'approved' or 'rejected'.");
  }

  // 如果是通过，必须要打分
  if (decision === "approved") {
    if (score == null || typeof score !== "number" || score < 0 || score > 5) {
      return res.status(400).send("Score must be a number between 0 and 5.");
    }
  }

  try {
    const skillRef = admin.firestore().doc(`skills/${skillId}`);
    const skillDoc = await skillRef.get();

    if (!skillDoc.exists) return res.status(404).send("Skill not found");

    const updateData = {
      verified: decision,
      reviewedBy: req.user.uid,
      reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
      note: note || "",
    };

    if (decision === "approved") {
      updateData.score = score;
    }

    await skillRef.update(updateData);
    res.send("Skill reviewed successfully.");
  } catch (error) {
    console.error("Skill verification failed:", error);
    res.status(500).send("Failed to review skill.");
  }
});

// GET /teacher/my-courses
router.get("/my-courses", verifyTeacher, async (req, res) => {
  try {
    const courseSnapshot = await admin.firestore()
      .collection("courses")
      .where("createdBy", "==", admin.firestore().doc(`users/${req.user.uid}`))
      .get();

    const courses = [];

    for (const doc of courseSnapshot.docs) {
      const course = doc.data();
      const courseId = doc.id;

      // 查询该课程关联的技能数量
      const skillSnapshot = await admin.firestore()
        .collection("skills")
        .where("courseId", "==", courseId)
        .get();

      courses.push({
        id: courseId,
        ...course,
        studentCount: skillSnapshot.size, // 加上这个字段
      });
    }

    res.json(courses);
  } catch (err) {
    console.error("Failed to fetch teacher courses:", err);
    res.status(500).send("Error fetching courses");
  }
});

// GET /teacher/pending-skills
router.get("/pending-skills", verifyTeacher, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection("skills")
      .where("verified", "==", "pending") //  修复：改为 "pending"
      .get();

    const results = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const ownerDoc = await admin.firestore().doc(`users/${data.ownerId}`).get();

      if (ownerDoc.exists && ownerDoc.data().schoolId === req.user.schoolId) {
        results.push({ id: doc.id, ...data });
      }
    }

    res.json(results);
  } catch (err) {
    console.error("Error fetching pending skills:", err);
    res.status(500).send("Failed to fetch skills");
  }
});


export default router;
