const express = require("express");
const Photos = require("../db/photoModel");
const Users = require("../db/userModel");
const router = express.Router();

router.post("/", async (req, res) => {});

router.get('/:id', async function (request, response) {
  try {
      var id = request.params.id;
      const photos = await Photos.find({ user_id: id });
      if (!photos || photos.length === 0) {
          console.log(`** Photos for user with id ${id}: Not Found! **`);
          return response.status(400).json({message: "NOT FOUND"});
      }
      const listPhotos = JSON.parse(JSON.stringify(photos))
      for (let photo of listPhotos) {
          delete photo.__v;
          for (let comment of photo.comments) {
              console.log(comment)
              const user = await Users.findOne({ _id: comment.user_id });
              if (user) {
                  const { location, description, occupation, __v, ...rest } = user.toJSON();
                  comment["user"] = rest;
              }
          }
      }
      response.json(listPhotos);
  } catch (error) {
      console.error("Error:", error);
      response.status(500).send("Internal Server Error");
  }
});


module.exports = router;
