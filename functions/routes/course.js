import express from "express";
import admin from "firebase-admin";

const router = express.Router();
const FieldValue = admin.firestore.FieldValue;

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
        if (user.role !== "school") return res.status(403).send("Access denied. Only teachers allowed.");
        req.user = { uid, ...user };
        next();
    } catch (err) {
        console.error("Teacher token verification failed:", err);
        return res.status(403).send("Invalid token");
    }
}

// POST /course/create
router.post("/create", verifyTeacher, async (req, res) => {
    const { title, code, major, skillTemplate } = req.body;
    if (!title || !code || !major || !skillTemplate?.skillTitle) {
        return res.status(400).send("Missing required fields");
    }

    try {
        const softSkills = Array.isArray(skillTemplate?.softSkills)
            ? skillTemplate.softSkills.map(id => admin.firestore().doc(`soft-skills/${id}`))
            : [];

        const hardSkills = Array.isArray(skillTemplate?.hardSkills)
            ? skillTemplate.hardSkills
            : [];

        const courseData = {
            title,
            code,
            schoolId: req.user.schoolId,
            major: admin.firestore().doc(`majors/${major}`),
            createdBy: admin.firestore().doc(`users/${req.user.uid}`),
            createdAt: FieldValue.serverTimestamp(),
            studentCount: 0,
            skillTemplate: {
                skillTitle: skillTemplate.skillTitle || "",
                skillDescription: skillTemplate.skillDescription || "",
                softSkills,
                hardSkills
            }
        };

        const ref = await admin.firestore().collection("courses").add(courseData);
        res.status(201).send({ id: ref.id });
    } catch (err) {
        console.error("Failed to create course:", err.message);
        res.status(500).send("Course creation failed");
    }
});

// PUT /course/update/:id
router.put("/update/:id", verifyTeacher, async (req, res) => {
    const courseId = req.params.id;
    const { title, code, major, skillTemplate } = req.body;

    try {
        const courseRef = admin.firestore().doc(`courses/${courseId}`);
        const courseDoc = await courseRef.get();
        if (!courseDoc.exists) return res.status(404).send("Course not found");

        const courseData = courseDoc.data();
        const isCreator = courseData.createdBy?.path?.endsWith(req.user.uid);
        if (!isCreator) return res.status(403).send("You are not the creator of this course");

        const softSkills = Array.isArray(skillTemplate?.softSkills)
            ? skillTemplate.softSkills.map(id => admin.firestore().doc(`soft-skills/${id}`))
            : courseData.skillTemplate?.softSkills || [];

        const hardSkills = Array.isArray(skillTemplate?.hardSkills)
            ? skillTemplate.hardSkills
            : courseData.skillTemplate?.hardSkills || [];

        await courseRef.update({
            title: title || courseData.title,
            code: code || courseData.code,
            major: major ? admin.firestore().doc(`majors/${major}`) : courseData.major,
            skillTemplate: {
                skillTitle: skillTemplate?.skillTitle || courseData.skillTemplate?.skillTitle || "",
                skillDescription: skillTemplate?.skillDescription || courseData.skillTemplate?.skillDescription || "",
                softSkills,
                hardSkills
            }
        });

        res.send("Course updated successfully");
    } catch (err) {
        console.error("Course update failed:", err.message);
        res.status(500).send("Course update failed");
    }
});

// DELETE /course/delete/:id
router.delete("/delete/:id", verifyTeacher, async (req, res) => {
    const courseId = req.params.id;

    try {
        const courseRef = admin.firestore().doc(`courses/${courseId}`);
        const courseDoc = await courseRef.get();
        if (!courseDoc.exists) return res.status(404).send("Course not found");

        const courseData = courseDoc.data();
        const isCreator = courseData.createdBy?.path?.endsWith(req.user.uid);
        if (!isCreator) return res.status(403).send("You are not the creator of this course");

        await courseRef.delete();
        res.send("Course deleted successfully");
    } catch (err) {
        console.error("Course deletion failed:", err.message);
        res.status(500).send("Course deletion failed");
    }
});

// GET /course/majors
router.get("/majors", verifyTeacher, async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection("majors").get();
        const majors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(majors);
    } catch (err) {
        console.error("Failed to fetch majors:", err.message);
        res.status(500).send("Failed to retrieve majors");
    }
});

// GET /course/soft-skills
router.get("/soft-skills", verifyTeacher, async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection("soft-skills").get();
        const skills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(skills);
    } catch (err) {
        console.error("Failed to fetch soft skills:", err.message);
        res.status(500).send("Failed to fetch soft skills");
    }
});

export default router;
