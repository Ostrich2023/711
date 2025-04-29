const express = require("express");
const cors = require("cors");

// Route modules
const userRoutes = require("./routes/user");
const skillRoutes = require("./routes/skill");
const studentRoutes = require("./routes/student");
const schoolRoutes = require("./routes/school");
const employerRoutes = require("./routes/employer");
const jobRoutes = require("./routes/job");
const adminRoutes = require("./routes/admin"); 
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).send("Digital Skill Wallet API is running.");
});

// Route mounting
app.use("/user", userRoutes);
app.use("/skill", skillRoutes);
app.use("/student", studentRoutes);
app.use("/school", schoolRoutes);
app.use("/employer", employerRoutes);
app.use("/job", jobRoutes);
app.use("/admin", adminRoutes); 

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).send("Internal Server Error");
});

module.exports = app;
