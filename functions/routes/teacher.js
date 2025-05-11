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
        if (user.role !== "teacher") {
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

export default router;