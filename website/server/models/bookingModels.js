const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    user_id: [{ type: Schema.Types.ObjectId, ref: "User" , required: true }],
    user_google_id: [{ type: Schema.Types.ObjectId, ref: "GoogleUser" , required: true }],
    employee_id: [
      { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    ],
    hours_id: [{ type: Schema.Types.ObjectId, ref: "Hours", required: true }],
    isRating: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
