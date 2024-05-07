const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const AdminRouter = require("./routes/AdminRouter");
const PageRouter = require("./routes/PageRouter");

dbConnect();

app.use(cors());
app.use(express.json());
app.use("/user", UserRouter);
app.use("/photo", PhotoRouter);
app.use("/admin", AdminRouter);
app.use("/page", PageRouter);

app.get("/", (req, res) => {
  res.send({ message: "Hello from photo-sharing app API!" });
});


app.listen(3006, () => {
  console.log("server listening on port 3006");
});
