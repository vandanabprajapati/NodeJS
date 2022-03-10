const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
  studentName: {
    type: String,
    require: true,
  },
  standard: {
    type: Number,
    require: true,
  },
  rollNo: {
    type: Number,
    require: true,
  },
  area: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Students", StudentSchema);