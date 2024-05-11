const express = require("express");
const Photos = require("../db/photoModel");
const Users = require("../db/userModel");
const router = express.Router();
const verifyToken = require("../helpers/verifyToken");

router.post("/", async (req, res) => {});

router.get("/:id", async function (request, response) {
  try {
    var id = request.params.id;
    const photos = await Photos.find({ user_id: id });
    if (!photos || photos.length === 0) {
      console.log(`** Photos for user with id ${id}: Not Found! **`);
      return response.status(400).json({ message: "NOT FOUND" });
    }
    const listPhotos = JSON.parse(JSON.stringify(photos));
    for (let photo of listPhotos) {
      delete photo.__v;
      for (let comment of photo.comments) {
        const user = await Users.findOne({ _id: comment.user_id });
        if (user) {
          const { location, description, occupation, __v, ...rest } =
            user.toJSON();
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

router.post("/comment/:photoId", verifyToken, async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const comment = {
      user_id: req.user[0]._id,
      comment: req.body.commentContent,
    };
    const photo = await Photos.findByIdAndUpdate(photoId, {
      $push: { comments: comment },
    });
    if (photo) {
      res.json({ message: "Success" });
    } else {
      res.json({ message: "Fail" });
    }
  } catch (error) {
    console.error("Error:", error);
    response.status(500).send("Internal Server Error");
  }
});

router.get("/comment/:photoId", async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const photo = await Photos.findOne({ _id: photoId });
    if (photo) {
      const photoObj = JSON.parse(JSON.stringify(photo));
      for (let comment of photoObj.comments) {
        const user = await Users.findOne({ _id: comment.user_id });
        if (user) {
          const { location, description, occupation, __v, ...rest } = user.toJSON();
          comment["user"] = rest;
        }
      }
      res.json(photoObj);
    } else {
      res.json({ message: "Fail" });
    }
  } catch (error) {
    console.error("Error:", error);
    response.status(500).send("Internal Server Error");
  }
});

module.exports = router;
