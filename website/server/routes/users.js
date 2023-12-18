const express = require("express");

const authentication = require("../auth/auth")

const {
  allUsers,
  singleUser,
  createUser,
  modifyUser,
  deleteUser,
  login,
  authenticated,
  googleRegister,
  googleLogin
} = require("../controllers/usersController");
const route = express.Router();
route.post("/login", login);
route.post("/register/", createUser);
route.get("/login/:id", singleUser);
route.get("/all/", allUsers);
route.post('/google', googleRegister);
route.post('/google/verify', googleLogin)
route.put("/login/:id",  modifyUser);
route.delete("/login/:id", deleteUser);
route.get("/auth",authentication, authenticated);

module.exports = route;
