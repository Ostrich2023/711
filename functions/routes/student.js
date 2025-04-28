const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Middleware: Verify token and attach student info
async function verifyStudent(req, res, next) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) return res.status(401).send("Unauthorized");

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const userDoc = await admin.firestore().doc(`users/${uid}`).get();
    if (!userDoc.exists) return res.status(403).send("User not found");

    const userData = userDoc.data();
    if (userData.role !== "student") {
      return res.status(403).send("Access denied. Only students can use this endpoint.");
    }

    req.user = { uid, ...userData };
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).send("Invalid token");
  }
}

// GET /student/me
router.get("/me", verifyStudent, (req, res) => {
  const { uid, email, customUid, schoolId, role } = req.user;
  res.json({ uid, email, customUid, schoolId, role });
});

// GET /student/skills
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

// PUT /student/update-school
router.put("/update-school", verifyStudent, async (req, res) => {
    const { uid } = req.user;
    const { schoolId } = req.body;
  
    if (!schoolId || typeof schoolId !== "string") {
      return res.status(400).send("Invalid school ID.");
    }
  
    try {
      await admin.firestore().doc(`users/${uid}`).update({
        schoolId: schoolId.trim(),
      });
      res.status(200).send("School updated successfully.");
    } catch (error) {
      console.error("Error updating school:", error);
      res.status(500).send("Failed to update school.");
    }
  });

// PUT /student/job/:jobId/accept
router.put("/job/:jobId/accept", verifyStudent, async (req, res) => {
  const { jobId } = req.params;
  const { uid } = req.user;

  try {
    const jobDoc = await admin.firestore().doc(`jobs/${jobId}`).get();
    if (!jobDoc.exists) return res.status(404).send("Job not found");

    const jobData = jobDoc.data();
    if (jobData.studentId !== uid) {
      return res.status(403).send("You are not assigned to this job.");
    }

    await jobDoc.ref.update({ status: "accepted" });
    res.status(200).send("Job accepted successfully");
  } catch (error) {
    console.error("Error accepting job:", error.message);
    res.status(500).send("Failed to accept job");
  }
});

// PUT /student/job/:jobId/reject
router.put("/job/:jobId/reject", verifyStudent, async (req, res) => {
  const { jobId } = req.params;
  const { uid } = req.user;

  try {
    const jobDoc = await admin.firestore().doc(`jobs/${jobId}`).get();
    if (!jobDoc.exists) return res.status(404).send("Job not found");

    const jobData = jobDoc.data();
    if (jobData.studentId !== uid) {
      return res.status(403).send("You are not assigned to this job.");
    }

    await jobDoc.ref.update({ status: "rejected" });
    res.status(200).send("Job rejected successfully");
  } catch (error) {
    console.error("Error rejecting job:", error.message);
    res.status(500).send("Failed to reject job");
  }
});

// GET /student/jobs
router.get("/jobs", verifyStudent, async (req, res) => {
  const { uid } = req.user;

  try {
    const snapshot = await admin.firestore()
      .collection("jobs")
      .where("studentId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(jobs);
  } catch (error) {
    console.error("Failed to fetch student jobs:", error.message);
    res.status(500).send("Error retrieving jobs");
  }
});

module.exports = router;
