const express = require("express");
const {
  getEmployee,
  createEmployee,
  getEmployeeByID,
  updateEmployee,
  modifyEmployee,
} = require("../controllers/employeeController");

const route = express.Router();

route.get("/all", getEmployee);
route.post("/createE", createEmployee);
route.get("/all/:id", getEmployeeByID);
route.put("/all/:id", updateEmployee);
route.put("/all/modify/:id", modifyEmployee);
module.exports = route;
