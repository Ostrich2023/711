// routes/course.js
import express from "express";
import admin from "firebase-admin";

const router = express.Router();
const FieldValue = admin.firestore?.FieldValue ?? null;

async function verifyTeacher(req, res, next) {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) return res.status(401).send("Unauthorized");

    try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        const userDoc = await admin.firestore().doc(`users/${decoded.uid}`).get();
        if (!userDoc.exists) return res.status(403).send("User not found");

        const user = userDoc.data();
        if (user.role !== "teacher") {
            return res.status(403).send("Only teachers allowed.");
        }

        req.user = { uid: decoded.uid, ...user };
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).send("Invalid token");
    }
}

// POST /course/create 
router.post("/create", verifyTeacher, async (req, res) => {
    const { title, description, skillTemplate } = req.body;
    const teacherRef = admin.firestore().doc(`users/${req.user.uid}`);

    if (!title || !skillTemplate?.title) {
        return res.status(400).send("Missing required course or skill template info");
    }

    try {
        const docRef = await admin.firestore().collection("courses").add({
            title,
            description: description || "",
            skillTemplate: {
                title: skillTemplate.title || "",
                description: skillTemplate.description || "",
                level: skillTemplate.level || "Beginner",
            },
            createdBy: teacherRef,
            createdAt: FieldValue ? FieldValue.serverTimestamp() : new Date().toISOString(),
        });

        res.status(201).send({ id: docRef.id });
    } catch (error) {
        console.error("Failed to create course:", error);
        res.status(500).send("Error creating course");
    }
});

// GET /course/list (for all)
router.get("/list", async (req, res) => {
    try {
        const snapshot = await admin.firestore()
            .collection("courses")
            .orderBy("createdAt", "desc")
            .get();

        const courses = await Promise.all(snapshot.docs.map(async doc => {
            const data = doc.data();
            let createdByName = null;

            try {
                const teacherDoc = await data.createdBy.get();
                createdByName = teacherDoc.exists ? teacherDoc.data().name : null;
            } catch (e) {
                console.warn("Error resolving teacher reference:", e.message);
            }

            return {
                id: doc.id,
                ...data,
                createdByName,
            };
        }));

        res.send(courses);
    } catch (error) {
        console.error("Error fetching course list:", error);
        res.status(500).send("Failed to fetch courses");
    }
});

export default router;
