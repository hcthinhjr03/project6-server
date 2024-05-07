const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();

router.post("/", async (request, response) => {});

router.get("/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const photos = await Photo.find({ user_id: id });
    if (!photos) {
      console.log(`** Photos for user with id ${id}: Not Found! **`);
      return response.status(404).send("Photos not found for user");
    }

    console.log(`** Read server path /photosOfUser/${id} Success! **`);

    const processedPhotos = await Promise.all(
      photos.map(async (photo) => {
        delete photo.__v;

        const commentsWithUsers = await Promise.all(
          photo.comments.map(async (comment) => {
            const user = await User.findOne({ _id: comment.user_id });
            if (user) {
              const { location, description, occupation, __v, ...rest } = user;
              return { ...comment, user: rest };
            } else {
              console.warn(
                `** User ${comment.user_id} not found for comment **`,
              );
              return comment;
            }
          }),
        );
        photo.comments = commentsWithUsers;
        return photo;
      }),
    );
    response.json(processedPhotos);
  } catch (err) {
    console.error(`** Error retrieving photos for user ${id}: **`, err);
    response.status(500).send(JSON.stringify("Internal Server Error"));
  }
});

module.exports = router;
