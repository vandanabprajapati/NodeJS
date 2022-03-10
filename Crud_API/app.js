
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParese = require("body-parser");
const studentRouter = require("./StudentRouter");

const cors = require("cors");
app.use(cors());

app.use(bodyParese.json());
app.use("/api/Students", studentRouter);

app.get("/", (req, res) => {
  console.log("aa");
  res.send("Hello World");
});

mongoose
  .connect("mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected"))
  .catch((err) => {
    console.log(err);
  });

const port = 3050;
app.listen(port, () => console.log(`Server listning on port ${port}`))