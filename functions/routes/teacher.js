import express from "express";
import admin from "firebase-admin";

const router = express.Router();

// Middleware: verify token and extract teacher info
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

// 获取本校所有学生
router.get("/students", verifyToken, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection("users")
      .where("role", "==", "student")
      .where("schoolId", "==", req.user.schoolId)
      .get();

    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).send("Failed to retrieve students.");
  }
});

// 获取某个学生的技能
router.get("/student/:id/skills", verifyToken, async (req, res) => {
  const studentId = req.params.id;

  try {
    const studentDoc = await admin.firestore().doc(`users/${studentId}`).get();
    if (!studentDoc.exists) return res.status(404).send("Student not found");

    const student = studentDoc.data();
    if (student.role !== "student" || student.schoolId !== req.user.schoolId) {
      return res.status(403).send("Access denied for students from other schools.");
    }

    const snapshot = await admin.firestore()
      .collection("skills")
      .where("ownerId", "==", studentId)
      .orderBy("createdAt", "desc")
      .get();

    const skills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(skills);
  } catch (err) {
    console.error("Error fetching skills:", err);
    res.status(500).send("Failed to retrieve skills.");
  }
});

// 获取本校教师
router.get("/teachers", verifyToken, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection("users")
      .where("role", "==", "school")
      .where("schoolId", "==", req.user.schoolId)
      .get();

    const teachers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(teachers);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).send("Failed to retrieve teachers.");
  }
});

// 获取本校课程
router.get("/courses", verifyToken, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection("courses")
      .where("schoolId", "==", req.user.schoolId)
      .get();

    const courses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).send("Failed to retrieve courses.");
  }
});

//  // GET /course/:courseId/students
router.get("/course/:courseId/students", verifyToken, async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const snapshot = await admin.firestore()
      .collection("skills")
      .where("courseId", "==", courseId)
      .orderBy("createdAt", "desc")
      .get();

    const skills = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const studentDoc = await admin.firestore().doc(`users/${data.ownerId}`).get();
      const student = studentDoc.exists ? studentDoc.data() : null;
      if (student && student.schoolId === req.user.schoolId) {
        skills.push({
          id: doc.id,
          ...data,
          student: {
            id: studentDoc.id,
            name: student.name,
            email: student.email,
            major: student.major,
          },
        });
      }
    }

    res.json(skills);
  } catch (err) {
    console.error("Error fetching course student skills:", err);
    res.status(500).send("Failed to retrieve course student data.");
  }
});

// GET /school/:schoolId/students
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

// GET /school/course/:courseId/details
router.get("/course/:courseId/details", verifyToken, async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const courseRef = admin.firestore().doc(`courses/${courseId}`);
    const courseDoc = await courseRef.get();
    if (!courseDoc.exists) return res.status(404).send("Course not found");

    const course = courseDoc.data();

    const creatorRef = course.createdBy;
    const teacherDoc = await creatorRef.get();
    const teacher = teacherDoc.exists ? teacherDoc.data() : null;

    res.json({
      id: courseDoc.id,
      ...course,
      teacher: teacher ? {
        id: teacherDoc.id,
        name: teacher.name,
        email: teacher.email,
      } : null,
    });
  } catch (err) {
    console.error("Error fetching course details:", err);
    res.status(500).send("Failed to retrieve course details.");
  }
});

// GET /teacher/my-courses — 获取当前教师创建的课程
router.get("/my-courses", verifyToken, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection("courses")
      .where("createdBy", "==", admin.firestore().doc(`users/${req.user.uid}`))
      .get();

    const courses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(courses);
  } catch (err) {
    console.error("Failed to fetch teacher courses:", err.message);
    res.status(500).send("Failed to retrieve courses.");
  }
});

// GET /teacher/pending-skills — 获取当前教师所属学校的待审核技能
router.get("/pending-skills", verifyToken, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection("skills")
      .where("verified", "==", "pending")
      .get();

    const pendingSkills = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // 确保是本校学生
      const studentDoc = await admin.firestore().doc(`users/${data.ownerId}`).get();
      if (!studentDoc.exists) continue;

      const studentData = studentDoc.data();
      if (studentData.schoolId !== req.user.schoolId) continue;

      pendingSkills.push({
        id: doc.id,
        ...data,
        student: {
          id: studentDoc.id,
          name: studentData.name,
          email: studentData.email,
          major: studentData.major,
        },
      });
    }

    res.json(pendingSkills);
  } catch (err) {
    console.error("Error fetching pending skills:", err);
    res.status(500).send("Failed to retrieve pending skills.");
  }
});


export default router;
