const express = require("express");

const {
  allBooking,
  BookingById,
  createBooking,
  modifyBooking,
  deleteBooking,
} = require("../controllers/bookingController");
const route = express.Router();

route.get("/all" , allBooking);
route.get("/all/:id", BookingById);
route.post("/createP", createBooking);
route.put("/all/:id", modifyBooking);
route.delete("/all/:id", deleteBooking);

module.exports = route;