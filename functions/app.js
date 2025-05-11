import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import * as w3up from "@web3-storage/w3up-client";

import userRoutes from "./routes/user.js";
import skillRoutes from "./routes/skill.js";
import studentRoutes from "./routes/student.js";
import schoolRoutes from "./routes/school.js";
import employerRoutes from "./routes/employer.js";
import jobRoutes from "./routes/job.js";
import adminRoutes from "./routes/admin.js";

import courseRoutes from "./routes/course.js";
import teacherRoutes from "./routes/teacher.js";

const app = express();

// ✅ 注册中间件
app.use(cors({ origin: true }));
app.use(express.json());
app.use(fileUpload());

// ✅ 注册 REST 路由
app.use("/user", userRoutes);
app.use("/skill", skillRoutes);
app.use("/student", studentRoutes);
app.use("/school", schoolRoutes);
app.use("/employer", employerRoutes);
app.use("/job", jobRoutes);
app.use("/admin", adminRoutes);

app.use("/course", courseRoutes);
app.use("/teacher", teacherRoutes);

// ✅ 文件上传路由
app.post("/upload", async (req, res) => {
  try {
    const client = await w3up.create();
    await client.login(process.env.VITE_W3UP_SIGNIN_KEY);
    await client.setCurrentSpace(process.env.VITE_W3UP_SPACE_DID);

    const uploaded = req.files.file;

    const blob = new Blob([uploaded.data], { type: uploaded.mimetype });
    const file = new File([blob], uploaded.name, { type: uploaded.mimetype });

    const cid = await client.uploadFile(file);
    res.json({ cid });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ 健康检查
app.get("/", (_, res) => res.send("Functions API running."));

export default app;
