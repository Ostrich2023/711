import express from "express";
import admin from "firebase-admin";
import { verifyStudent } from "../middlewares/verifyRole.js";

const router = express.Router();
const FieldValue = admin.firestore?.FieldValue ?? null;

// GET /student/me — 获取学生个人信息
router.get("/me", verifyStudent, async (req, res) => {
  const { uid, email, customUid, schoolId, role, major, avatar } = req.user;
  let majorName = "";

  if (major) {
    try {
      const majorSnap = await admin.firestore().doc(`majors/${major}`).get();
      if (majorSnap.exists) {
        majorName = majorSnap.data().name;
      }
    } catch (err) {
      console.warn("Failed to load major name:", err);
    }
  }

  res.json({ uid, email, customUid, schoolId, role, major, majorName, avatar });
});

// GET /student/skills — 获取学生技能列表
router.get("/skills", verifyStudent, async (req, res) => {
  const { uid } = req.user;

  try {
    const snapshot = await admin.firestore()
      .collection("skills")
      .where("ownerId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const skills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(skills);
  } catch (error) {
    console.error("Failed to fetch student skills:", error.message);
    res.status(500).send("Error retrieving skills");
  }
});

// PUT /student/update-school — 更新学校
router.put("/update-school", verifyStudent, async (req, res) => {
  const { uid } = req.user;
  const { schoolId } = req.body;

  if (!schoolId || typeof schoolId !== "string") {
    return res.status(400).send("Invalid school ID.");
  }

  try {
    await admin.firestore().doc(`users/${uid}`).update({ schoolId: schoolId.trim() });
    res.status(200).send("School updated successfully.");
  } catch (error) {
    console.error("Error updating school:", error);
    res.status(500).send("Failed to update school.");
  }
});

// PUT /student/update-major — 更新专业
router.put("/update-major", verifyStudent, async (req, res) => {
  const { uid } = req.user;
  const { major } = req.body;

  if (!major || typeof major !== "string") {
    return res.status(400).send("Invalid major.");
  }

  try {
    await admin.firestore().doc(`users/${uid}`).update({ major });
    res.send("Major updated");
  } catch (error) {
    console.error("Error updating major:", error.message);
    res.status(500).send("Failed to update major");
  }
});

// GET /student/list-courses — 获取符合学生学校与专业的课程
router.get("/list-courses", verifyStudent, async (req, res) => {
  try {
    const { schoolId, major } = req.user;

    if (!schoolId || !major) {
      return res.status(400).send("Missing schoolId or major in profile.");
    }

    const majorRef = admin.firestore().doc(`majors/${major}`);

    const snapshot = await admin.firestore().collection("courses")
      .where("schoolId", "==", schoolId)
      .where("major", "==", majorRef)
      .get();

    const courses = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      let majorId = "";
      let majorName = "";
      if (data.major?.path) {
        const refParts = data.major.path.split("/");
        majorId = refParts[refParts.length - 1];
        const majorSnap = await data.major.get();
        majorName = majorSnap.exists ? majorSnap.data().name : "Unknown";
      }

      courses.push({
        id: doc.id,
        title: data.title,
        code: data.code,
        skillTemplate: data.skillTemplate,
        major: { id: majorId, name: majorName },
        schoolId: data.schoolId
      });
    }

    res.json(courses);
  } catch (err) {
    console.error("Failed to fetch student courses:", err);
    res.status(500).send("Failed to load courses");
  }
});

// GET /student/course-avg-scores — 获取每门课程的平均评分
router.get("/course-avg-scores", verifyStudent, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection("skills")
      .where("ownerId", "==", req.user.uid)
      .where("verified", "==", "approved")
      .get();

    const courseScores = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      const { courseTitle, score } = data;
      if (!courseScores[courseTitle]) {
        courseScores[courseTitle] = { total: 0, count: 0 };
      }
      courseScores[courseTitle].total += score || 0;
      courseScores[courseTitle].count += 1;
    });

    const results = Object.entries(courseScores).map(([courseTitle, { total, count }]) => ({
      courseTitle,
      avgScore: (total / count).toFixed(2)
    }));

    res.json(results);
  } catch (error) {
    console.error("Failed to fetch course average scores:", error);
    res.status(500).send("Error retrieving course scores");
  }
});

// GET /student/my-teachers — 获取本校所有教师
router.get("/my-teachers", verifyStudent, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection("users")
      .where("role", "==", "school")
      .where("schoolId", "==", req.user.schoolId)
      .get();

    const teachers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(teachers);
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    res.status(500).send("Failed to load teachers");
  }
});

// POST /student/apply — 提交职位申请
router.post("/apply", verifyStudent, async (req, res) => {
  const { jobId, skillsSnapshot } = req.body;

  if (!jobId || !Array.isArray(skillsSnapshot)) {
    return res.status(400).send("Missing required fields");
  }

  try {
    await admin.firestore().collection("applications").add({
      jobId,
      studentId: req.user.uid,
      skillsSnapshot,
      appliedAt: FieldValue.serverTimestamp(),
    });

    res.send("Application submitted");
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).send("Failed to submit application");
  }
});

// GET /student/my-applications — 获取已申请的职位
router.get("/my-applications", verifyStudent, async (req, res) => {
  const { uid } = req.user;
  try {
    const snapshot = await admin.firestore()
      .collection("applications")
      .where("studentId", "==", uid)
      .orderBy("appliedAt", "desc")
      .get();

    const results = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const jobDoc = await admin.firestore().doc(`jobs/${data.jobId}`).get();
      const job = jobDoc.exists ? jobDoc.data() : {};
      results.push({
        id: doc.id,
        appliedAt: data.appliedAt,
        jobTitle: job.title || "Unknown",
        company: job.company || "Unknown",
      });
    }

    res.json(results);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).send("Failed to fetch applications");
  }
});

export default router;
