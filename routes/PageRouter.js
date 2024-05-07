const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const router = express.Router();


function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  var privateKey = fs.readFileSync("private.key");
  if (typeof token !== "undefined") {
    jwt.verify(token.split(" ")[1], privateKey, (err, decoded) => {
      if (err) {
        res.status(403).send("Invalid token");
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } else {
    res.status(401).send("Unauthorized");
  }
}

router.get("/home", verifyToken, (req, res) => {
  res.send("Welcome to the Home page");
});

module.exports = router;
