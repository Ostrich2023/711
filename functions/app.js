import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

//  Debug wrap — 捕捉非法路径注册
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

//  路由模块
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

//  跨域配置（支持 Firebase Token）
const corsOptions = {
  origin: [
    "https://digital-skill-wallet.web.app", //  正式前端域名
    "http://localhost:5173",                //  本地前端开发
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
};

//  应用跨域中间件 + 预检支持
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

//  JSON 请求体解析
app.use(express.json());

//  文件上传中间件
app.use(fileUpload());

//  路由注册
app.use("/user", userRoutes);
app.use("/skill", skillRoutes);
app.use("/student", studentRoutes);
app.use("/school", schoolRoutes);
app.use("/employer", employerRoutes);
app.use("/job", jobRoutes);
app.use("/admin", adminRoutes);
app.use("/course", courseRoutes);
app.use("/teacher", teacherRoutes);

//  健康检查接口
app.get("/", (_, res) => res.send("Functions API running."));

export default app;
