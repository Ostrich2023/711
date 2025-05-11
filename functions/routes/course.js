import express from "express";
import admin from "firebase-admin";

const router = express.Router();
const FieldValue = admin.firestore.FieldValue; //  确保正确引用

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
    if (user.role !== "school") { //  你定义的是 school 作为 teacher
      return res.status(403).send("Access denied. Only teachers allowed.");
    }

    req.user = { uid, ...user };
    next();
  } catch (err) {
    console.error("Teacher token verification failed:", err);
    return res.status(403).send("Invalid token");
  }
}

//  POST /course/create
router.post("/create", verifyTeacher, async (req, res) => {
  const { title, code, skillTemplate } = req.body;

  if (!title || !code || !skillTemplate?.skillTitle) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const courseData = {
      title,
      code,
      schoolId: req.user.schoolId, //  关联课程到学校
      createdBy: admin.firestore().doc(`users/${req.user.uid}`),
      createdAt: FieldValue.serverTimestamp(), //  使用 Firestore 时间戳
      skillTemplate: {
        skillTitle: skillTemplate.skillTitle || "",
        skillDescription: skillTemplate.skillDescription || "",
      },
    };

    const ref = await admin.firestore().collection("courses").add(courseData);
    res.status(201).send({ id: ref.id });
  } catch (err) {
    console.error("Failed to create course:", err.message);
    res.status(500).send("Course creation failed");
  }
});

export default router;
