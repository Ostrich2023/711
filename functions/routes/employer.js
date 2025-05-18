import express from "express";
import admin from "firebase-admin";

const router = express.Router();

// Middleware: verify employer identity
async function verifyEmployer(req, res, next) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) return res.status(401).send("Unauthorized");

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const userDoc = await admin.firestore().doc(`users/${uid}`).get();
    if (!userDoc.exists) return res.status(403).send("User not found");

    const userData = userDoc.data();
    if (userData.role !== "employer") {
      return res.status(403).send("Access denied. Only employers can use this endpoint.");
    }

    req.user = { uid, ...userData };
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).send("Invalid token");
  }
}

// GET /employer/student/:id
router.get("/student/:id", verifyEmployer, async (req, res) => {
  const studentId = req.params.id;

  try {
    const studentDoc = await admin.firestore().doc(`users/${studentId}`).get();
    if (!studentDoc.exists) return res.status(404).send("Student not found");

    const studentData = studentDoc.data();
    if (studentData.role !== "student") {
      return res.status(403).send("The requested user is not a student.");
    }

    const { email, customUid, schoolId } = studentData;
    res.json({ email, customUid, schoolId });
  } catch (error) {
    console.error("Error fetching student info:", error.message);
    res.status(500).send("Error retrieving student data");
  }
});

// GET /employer/student/:id/skills
router.get("/student/:id/skills", verifyEmployer, async (req, res) => {
  const studentId = req.params.id;

  try {
    const snapshot = await admin.firestore()
      .collection("skills")
      .where("ownerId", "==", studentId)
      .orderBy("createdAt", "desc")
      .get();

    const skills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(skills);
  } catch (error) {
    console.error("Error fetching student skills:", error.message);
    res.status(500).send("Error retrieving skills");
  }
});

// GET /employer/schools
router.get("/schools", async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("schools").get();
    const schools = snapshot.docs.map(doc => ({
      code: doc.data().code,
      name: doc.data().name,
    }));
    res.json(schools);
  } catch (err) {
    console.error("Error fetching schools:", err);
    res.status(500).send("Failed to fetch school list");
  }
});

// GET /employer/school/:schoolId/students
router.get("/school/:schoolId/students", verifyEmployer, async (req, res) => {
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
    console.error("Error fetching students for employer:", err.message);
    res.status(500).send("Failed to retrieve students");
  }
});

// GET /employer/students/skills/:skill
router.get("/students/skills/:skill", verifyEmployer, async (req, res) => {
  const { skill } = req.params;

  try {
    const snapshot = await admin.firestore()
      .collection("users")
      .where("role", "==", "student")
      .where("skills", "array-contains", skill)
      .get();

    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(students);
  } catch (error) {
    console.error("Error searching students by skill:", error.message);
    res.status(500).send("Failed to search students");
  }
});

// GET /employer/applications/:jobId
router.get("/applications/:jobId", verifyEmployer, async (req, res) => {
  const { jobId } = req.params;

  try {
    const snapshot = await admin.firestore()
      .collection("applications")
      .where("jobId", "==", jobId)
      .orderBy("appliedAt", "desc")
      .get();

    const applications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error.message);
    res.status(500).send("Failed to retrieve applications");
  }
});

// GET /employer/recent-applications
router.get("/recent-applications", verifyEmployer, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection("applications")
      .where("employerId", "==", req.user.uid)
      .orderBy("appliedAt", "desc")
      .limit(10)
      .get();

    const applications = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const studentDoc = await admin.firestore().doc(`users/${data.studentId}`).get();
      const studentName = studentDoc.exists ? studentDoc.data().name : "Unknown";

      applications.push({
        id: doc.id,
        jobId: data.jobId,
        studentId: data.studentId,
        studentName,
        message: data.message || "",
        appliedAt: data.appliedAt,
      });
    }

    res.json(applications);
  } catch (error) {
    console.error("Error fetching recent applications:", error);
    res.status(500).send("Failed to retrieve recent applications");
  }
});

// GET /employer/application-summary
router.get("/application-summary", verifyEmployer, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection("applications")
      .where("employerId", "==", req.user.uid)
      .get();

    let total = 0;
    let viewed = 0;
    let unread = 0;

    snapshot.forEach(doc => {
      total += 1;
      const data = doc.data();
      if (data.viewed) viewed += 1;
      else unread += 1;
    });

    res.json({ total, viewed, unread });
  } catch (error) {
    console.error("Error fetching application summary:", error);
    res.status(500).send("Failed to fetch summary");
  }
});

// GET /employer/approved-students
router.get("/approved-students", verifyEmployer, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection("skills")
      .where("verified", "==", "approved")
      .get();

    const studentMap = new Map();

    for (const doc of snapshot.docs) {
      const skill = doc.data();
      const studentId = skill.ownerId;

      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, []);
      }
      studentMap.get(studentId).push({ id: doc.id, ...skill });
    }

    const results = [];

    for (const [studentId, skills] of studentMap.entries()) {
      const studentDoc = await admin.firestore().doc(`users/${studentId}`).get();
      if (!studentDoc.exists) continue;
      const student = studentDoc.data();
      results.push({
        studentId,
        studentName: student.name || "Unknown",
        email: student.email,
        customUid: student.customUid,
        schoolId: student.schoolId,
        major: student.major,
        skills,
      });
    }

    res.json(results);
  } catch (error) {
    console.error("Error loading approved students:", error);
    res.status(500).send("Failed to load approved students");
  }
});

export default router;
