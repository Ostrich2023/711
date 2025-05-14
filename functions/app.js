import dotenv from "dotenv";
dotenv.config();

import express from "express";

// Debug wrap — 捕捉非法路径注册
const wrapMethods = ["get", "post", "put", "delete", "use"];
wrapMethods.forEach((method) => {
  const original = express.Router.prototype[method];
  express.Router.prototype[method] = function (path, ...handlers) {
    if (typeof path === "string" && path.startsWith("http")) {
      console.trace(`❗Illegal router.${method} path: ${path}`);
    }
    return original.call(this, path, ...handlers);
  };
});

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

// 处理所有 OPTIONS 请求，解决 CORS 预检失败
app.options("*", cors());

// 跨域中间件
app.use(
  cors({
    origin: [
      "https://digital-skill-wallet.web.app", // Firebase Hosting 地址
      "http://localhost:5173",                // 本地开发环境
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// JSON 解析中间件
app.use(express.json());

// 文件上传支持
app.use(fileUpload());

// 注册各模块路由
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
