const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
    },
    password: {
      type: String,
      required: true,
      unique: false,
    },
    phone: {
      type: Number,
      required: true,
      unique: false,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
