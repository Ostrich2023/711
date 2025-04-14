// functions/routes/user.js

const express = require("express");
const router = express.Router();

// get user info(testing)
router.get("/info", (req, res) => {
  res.json({
    status: "success",
    message: "done /api/user/info ！"
  });
});

module.exports = router;
