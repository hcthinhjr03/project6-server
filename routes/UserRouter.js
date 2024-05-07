const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.post("/", async (request, response) => {});

router.get("/list", async (request, response) => {
  try {
    const users = await User.find({});
    console.log("** Read server path /user/list Success! **");
    const newUsers = users.map((user) => {
      const { first_name, last_name, _id } = user;
      return { first_name, last_name, _id };
    });
    response.json(newUsers);
  } catch (err) {
    console.log("** Get user list: Error! **");
    response.status(500).send(JSON.stringify(err));
  }
});

router.get("/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const user = await User.findOne({ _id: id });

    if (!user) {
      console.log(`** User ${id}: Not Found! **`);
      return response.status(404).send("User not found");
    }

    console.log(`** Read server path /user/${id} Success! **`);
    delete user.__v;
    response.json(user);
  } catch (err) {
    console.log(`** User ${id}: Error! **`);
    response.status(500).send(JSON.stringify(err));
  }
});

module.exports = router;
