const express = require("express");
const router = express.Router();
const Students = require("./StudentSchema");

router.get("/", async (req, res) => {
  try {
    res.json(await Students.find());
  } catch (err) {
    console.log({ errorMessage: err });
  }
});

router.get("/:studID", async (req, res) => {
  try {
    res.json(await Students.findById(req.params.studID));
  } catch (err) {
    console.log({ errorMessage: err });
  }
});

router.post("/", async (req, res) => {
  const student = new Students({
    studentName: req.body.studentName,
    standard: req.body.standard,
    rollNo: req.body.rollNo,
    area: req.body.area,
  });

  try {
    res.json(await student.save());
  } catch (err) {
    console.log({ errorMessage: err });
  }
});

router.put("/:studID", async (req, res) => {
  const student = new Students({
    studentName: req.body.studentName,
    standard: req.body.standard,
    rollNo: req.body.rollNo,
    area: req.body.area,
  });

  try {
    res.json(
      await Students.updateOne(
        { _id: req.params.studID },
        {
          $set: {
            studentName: req.body.studentName,
            standard: req.body.standard,
            rollNo: req.body.rollNo,
            area: req.body.area,
          },
        }
      )
    );
  } catch (err) {
    console.log({ errorMessage: err });
  }
});

router.delete("/:studID", async (req, res) => {
  try {
    res.json(await Students.deleteOne({ _id: req.params.studID }));
  } catch (err) {
    console.log({ errorMessage: err });
  }
});

module.exports = router;