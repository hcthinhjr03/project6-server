const express = require("express");
const router = express.Router();
const verifyToken = require('../helpers/verifyToken');

router.get("/home", verifyToken, (req, res) => {
  res.send("Welcome to the Home page");
});

module.exports = router;
