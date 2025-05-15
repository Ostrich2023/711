import express from "express";
import admin from "firebase-admin";

const router = express.Router();
const FieldValue = admin.firestore.FieldValue;

// 获取用户角色
async function getUserRole(uid) {
    if (!uid) return null;
    const userDoc = await admin.firestore().doc(`users/${uid}`).get();
    return userDoc.exists ? userDoc.data().role : null;
}

// 创建岗位 - POST /job/create
router.post("/create", async (req, res) => {
    const { uid, title, description, price, location, skills, positions } = req.body;

    const role = await getUserRole(uid);
    if (role !== "employer") return res.status(403).send("Only employers can create jobs");

    try {
        const jobRef = await admin.firestore().collection("jobs").add({
            title,
            description,
            price,
            location,
            skills,
            employerId: uid,
            positions: positions || 1,
            createdAt: FieldValue.serverTimestamp(),
            status: "pending",
        });

        res.status(201).json({ jobId: jobRef.id });
    } catch (err) {
        console.error("Create job error:", err.message);
        res.status(500).send("Failed to create job");
    }
});

// 获取岗位列表 - GET /job/list?uid=xxx
router.get("/list", async (req, res) => {
    const { uid } = req.query;

    try {
        if (!uid) return res.status(400).send("Missing uid");

        const role = await getUserRole(uid);
        if (!role) return res.status(403).send("Unauthorized");

        let query = admin.firestore().collection("jobs");

        if (role === "employer") {
            query = query.where("employerId", "==", uid);
        } else if (role === "student") {
            query = query.where("studentId", "==", uid);
        } else {
            return res.status(403).send("Role not supported");
        }

        const snapshot = await query.orderBy("createdAt", "desc").get();
        const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(jobs);
    } catch (error) {
        res.status(500).send("Failed to fetch jobs");
    }
});

// 获取单个岗位 - GET /job/:id?uid=xxx
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const { uid } = req.query;

    try {
        const jobDoc = await admin.firestore().doc(`jobs/${id}`).get();
        if (!jobDoc.exists) return res.status(404).send("Job not found");

        const job = jobDoc.data();
        if (job.employerId !== uid && job.studentId !== uid) {
            return res.status(403).send("Access denied");
        }

        res.status(200).json({ id: jobDoc.id, ...job });
    } catch (err) {
        console.error("Fetch job error:", err.message);
        res.status(500).send("Failed to fetch job");
    }
});

// 更新岗位 - PUT /job/update/:id
router.put("/update/:id", async (req, res) => {
    const { uid, title, description, price, location, skills, positions } = req.body;
    const { id } = req.params;

    try {
        const role = await getUserRole(uid);
        if (role !== "employer") return res.status(403).send("Only employers can update jobs");

        const jobRef = admin.firestore().collection("jobs").doc(id);
        const jobDoc = await jobRef.get();
        if (!jobDoc.exists) return res.status(404).send("Job not found");

        const jobData = jobDoc.data();
        if (jobData.employerId !== uid) return res.status(403).send("Not authorized to update this job");

        await jobRef.update({
            title,
            description,
            price,
            location,
            skills,
            positions,
        });

        res.status(200).send("Job updated");
    } catch (err) {
        console.error("Update job error:", err.message);
        res.status(500).send("Failed to update job");
    }
});

// 删除岗位 - DELETE /job/delete/:id?uid=xxx
router.delete("/delete/:id", async (req, res) => {
    const { uid } = req.query;
    const { id } = req.params;

    try {
        const role = await getUserRole(uid);
        if (role !== "employer") return res.status(403).send("Only employers can delete jobs");

        const jobRef = admin.firestore().collection("jobs").doc(id);
        const jobDoc = await jobRef.get();
        if (!jobDoc.exists) return res.status(404).send("Job not found");

        const jobData = jobDoc.data();
        if (jobData.employerId !== uid) return res.status(403).send("Not authorized to delete this job");

        await jobRef.delete();
        res.status(200).send("Job deleted");
    } catch (err) {
        console.error("Delete job error:", err.message);
        res.status(500).send("Failed to delete job");
    }
});

export default router;
