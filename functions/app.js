import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

// 路由模块
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

// 注册中间件
app.use(
  cors({
    origin: [
      "https://digital-skill-wallet.web.app", // 前端生产地址
      "http://localhost:5173",                // 本地开发地址
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());
app.use(fileUpload());

// 注册 REST 路由
app.use("/user", userRoutes);
app.use("/skill", skillRoutes);
app.use("/student", studentRoutes);
app.use("/school", schoolRoutes);
app.use("/employer", employerRoutes);
app.use("/job", jobRoutes);
app.use("/admin", adminRoutes);
app.use("/course", courseRoutes);
app.use("/teacher", teacherRoutes);

// 健康检查
app.get("/", (_, res) => res.send("Functions API running."));

export default app;
