const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

router.get("/profile", authenticateToken, async (req, res) => {
  const uid = req.user.uid;
  res.json({ message: "Protected profile info", uid });
});

module.exports = router;
