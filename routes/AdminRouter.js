const express = require("express");
const Users = require("../db/userModel");
const jwt = require('jsonwebtoken');
const router = express.Router();
const fs = require('fs');

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.find({ username, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    var privateKey = fs.readFileSync('private.key');
    const token = jwt.sign({ user }, privateKey, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/logout", async (req, res) => {
  res.send("Please Login");
});

module.exports = router;
