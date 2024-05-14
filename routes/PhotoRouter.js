const express = require("express");
const Photos = require("../db/photoModel");
const Users = require("../db/userModel");
const router = express.Router();
const verifyToken = require("../helpers/verifyToken");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//Lay anh cua user theo userid
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

//Tao comment moi theo photoId
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

//Lay tat ca comment cua anh theo photoId
router.get("/comment/:photoId", async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const photo = await Photos.findOne({ _id: photoId });
    if (photo) {
      const photoObj = JSON.parse(JSON.stringify(photo));
      for (let comment of photoObj.comments) {
        const user = await Users.findOne({ _id: comment.user_id });
        if (user) {
          const { location, description, occupation, __v, ...rest } =
            user.toJSON();
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

//Tao photo moi
// router.post("/upload", verifyToken, async (req, res) => {
//   try {
//     const photo = {
//       file_name: req.body.file_name,
//       user_id: req.user[0]._id,
//     };
//     const newPhoto = await Photos.create(photo);
//     if(!newPhoto){
//       res.status(400).send("Fail");
//     }
//     res.json(newPhoto);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

router.post(
  "/upload",
  upload.single("avatar"),
  verifyToken,
  async (req, res) => {
    try {
      console.log(req.file);
      const photo = {
        file_name: req.file.filename,
        user_id: req.user[0]._id,
      };
      const newPhoto = await Photos.create(photo);
      if (!newPhoto) {
        res.status(400).send("Fail");
      }
      res.json(newPhoto);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Xoa photo theo photoId
router.delete("/:id", async (req, res) => {
  try {
    const photoId = req.params.id;
    const delPhoto = await Photos.deleteOne({ _id: photoId });
    if (delPhoto.deletedCount === 0) {
      res.status(404).send("Photo not found!");
    }
    res.json({ message: "Delete Success!" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
