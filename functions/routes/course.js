import express from "express";
import admin from "firebase-admin";

const router = express.Router();
const FieldValue = admin.firestore?.FieldValue ?? null;

// verifyTeacher
async function verifyTeacher(req, res, next) {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) return res.status(401).send("Unauthorized");

    try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        const userDoc = await admin.firestore().doc(`users/${decoded.uid}`).get();
        if (!userDoc.exists) return res.status(403).send("User not found");

        const user = userDoc.data();
        if (user.role !== "teacher") {
            return res.status(403).send("Access denied. Only teachers allowed.");
        }

        req.user = { uid: decoded.uid, ...user };
        next();
    } catch (err) {
        console.error("Teacher token error:", err);
        return res.status(403).send("Invalid token");
    }
}

// POST /course/create
router.post("/create", verifyTeacher, async (req, res) => {
    const { title, code, skillTemplate } = req.body;

    if (!title || !code || !skillTemplate?.skillTitle) {
        return res.status(400).send("Missing required fields");
    }

    try {
        const courseData = {
            title,
            code,
            createdBy: admin.firestore().doc(`users/${req.user.uid}`),
            createdAt: FieldValue ? FieldValue.serverTimestamp() : new Date().toISOString(),
            skillTemplate: {
                skillTitle: skillTemplate.skillTitle || "",
                skillDescription: skillTemplate.skillDescription || "",
                level: skillTemplate.level || "Beginner",
            },
        };
        const ref = await admin.firestore().collection("courses").add(courseData);
        res.status(201).send({ id: ref.id });
    } catch (err) {
        console.error("Failed to create course:", err.message);
        res.status(500).send("Course creation failed");
    }
});

// DELETE /course/delete/:id
router.delete("/delete/:id", verifyTeacher, async (req, res) => {
    const courseId = req.params.id;

    try {
        const courseRef = admin.firestore().doc(`courses/${courseId}`);
        const doc = await courseRef.get();

        if (!doc.exists) return res.status(404).send("Course not found");

        const course = doc.data();
        const createdByPath = course.createdBy?.path;

        if (!createdByPath || !createdByPath.endsWith(req.user.uid)) {
            return res.status(403).send("You are not the creator of this course");
        }

        await courseRef.delete();
        res.send("Course deleted successfully");
    } catch (err) {
        console.error("Course deletion failed:", err.message);
        res.status(500).send("Course deletion failed");
    }
});

export default router;
