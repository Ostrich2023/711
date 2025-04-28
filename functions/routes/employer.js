const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

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

//  GET /employer/student/:id
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

//  GET /employer/student/:id/skills
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

//  GET /employer/schools
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

// POST /employer/job
router.post("/job", verifyEmployer, async (req, res) => {
  const { title, description, price, location, skills } = req.body;

  if (!title || !description || !price || !location || !skills) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const jobRef = await admin.firestore().collection("jobs").add({
      title,
      description,
      price,
      location,
      skills,
      employerId: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ jobId: jobRef.id });
  } catch (error) {
    console.error("Error creating job:", error.message);
    res.status(500).send("Failed to create job");
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

// PUT /employer/job/:jobId/assign/:studentId
router.put("/job/:jobId/assign/:studentId", verifyEmployer, async (req, res) => {
  const { jobId, studentId } = req.params;

  try {
    const jobDoc = await admin.firestore().doc(`jobs/${jobId}`).get();
    if (!jobDoc.exists) return res.status(404).send("Job not found");

    const studentDoc = await admin.firestore().doc(`users/${studentId}`).get();
    if (!studentDoc.exists || studentDoc.data().role !== "student") {
      return res.status(404).send("Student not found");
    }

    await jobDoc.ref.update({ studentId });

    res.status(200).send("Job assigned successfully");
  } catch (error) {
    console.error("Error assigning job:", error.message);
    res.status(500).send("Failed to assign job");
  }
});


// PUT /employer/job/:jobId/status
router.put("/job/:jobId/status", verifyEmployer, async (req, res) => {
  const { jobId } = req.params;
  const { status } = req.body;

  if (!status || !['accepted', 'rejected', 'completed'].includes(status)) {
    return res.status(400).send("Invalid status.");
  }

  try {
    const jobDoc = await admin.firestore().doc(`jobs/${jobId}`).get();
    if (!jobDoc.exists) return res.status(404).send("Job not found");

    await jobDoc.ref.update({ status });
    res.status(200).send("Job status updated successfully");
  } catch (error) {
    console.error("Error updating job status:", error.message);
    res.status(500).send("Failed to update job status");
  }
});


// PUT /employer/job/:jobId/verify
router.put("/job/:jobId/verify", verifyEmployer, async (req, res) => {
  const { jobId } = req.params;

  try {
    const jobDoc = await admin.firestore().doc(`jobs/${jobId}`).get();
    if (!jobDoc.exists) return res.status(404).send("Job not found");

    const jobData = jobDoc.data();
    if (jobData.status !== 'completed') {
      return res.status(400).send("Job is not marked as completed by the student.");
    }

    await jobDoc.ref.update({ verified: true });
    res.status(200).send("Job verified successfully");
  } catch (error) {
    console.error("Error verifying job:", error.message);
    res.status(500).send("Failed to verify job");
  }
});


// GET /employer/jobs
router.get("/jobs", verifyEmployer, async (req, res) => {
  const { uid } = req.user;

  try {
    const snapshot = await admin.firestore()
      .collection("jobs")
      .where("employerId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs for employer:", error.message);
    res.status(500).send("Failed to retrieve jobs");
  }
});

