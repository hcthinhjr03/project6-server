const express = require("express");
const Photos = require("../db/photoModel");
const Users = require("../db/userModel");
const router = express.Router();

router.post("/", async (req, res) => {});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const photos = await Photos.find({ user_id: id });
    if (photos.length === 0) {
      return res.status(404).send("Photos not found for user");
    }
    const processedPhotos = photos.map(async (photo) => {
      delete photo.__v;
      const commentsWithUsers = await Promise.all(
        photo.comments.map(async (comment) => {
          const user = await Users.findOne({ _id: comment.user_id });
          if (user) {
            const { location, description, occupation, __v, ...rest } = user;
            return { ...comment, user: rest };
          } else {
            console.warn(
              ` User ${comment.user_id} not found for comment `
            );
            return comment;
          }   
        })
      );
      photo.comments = commentsWithUsers;
      return photo;
    });
    const results = await Promise.all(processedPhotos);
    res.json(results);
  } catch (err) {
    console.error(err); 
    res.status(500).send(JSON.stringify("Internal Server Error"));
  }
});

module.exports = router;
