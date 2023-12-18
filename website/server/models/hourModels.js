const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HoursSchema = new Schema({
  hours: {
    type: String,
    required: true,
  },
},{ timestamps: true });

const Hours = mongoose.model("Hours", HoursSchema);

module.exports = Hours;
