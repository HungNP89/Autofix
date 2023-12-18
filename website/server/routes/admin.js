const express = require("express");
const {
  admin,
  createAdmin,
  adminById,
  modifyAdmin,
  deleteAdmin,
  loginAdmin,
  authenticated
} = require("../controllers/adminController");
const authentication = require("../auth/auth");

const route = express.Router();
route.post("/login", loginAdmin);
route.post("/createAd", createAdmin);
route.get("/all", admin);
route.get("/all/:id", adminById);
route.put("/all/:id", modifyAdmin);
route.delete("/all/:id", deleteAdmin);

module.exports = route;
