const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema(
  {
    employee_name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    totalRating: {
      type: Number, 
      min: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;