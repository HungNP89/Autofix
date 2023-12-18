const employeeModel = require("../models/employeeModels");
const bookingModel = require("../models/bookingModels");
const moment = require("moment");

const getEmployee = async (req, res) => {
  try {
    const { id, date, hour } = req.query;
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const bookedEmployeeIds = await bookingModel.distinct("employee_id", {
      date: formattedDate,
      hours_id: hour,
      status: { $ne: 4 },
    });
    
    const availableEmployees = await employeeModel
      .find({ _id: { $nin: bookedEmployeeIds } })
      .exec();

    res.json(availableEmployees);
  } catch (err) {
    res.status(500).send(err);
  }
};

const createEmployee = async (req, res) => {
  const employee = new employeeModel(req.body);
  console.log(employee);
  try {
    await employee.save();
    res.send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getEmployeeByID = async (req, res) => {
  const employee = await employeeModel.findById({ _id: req.params.id });
  try {
    res.json(employee);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateEmployee = async (req, res) => {
  try {
    
    const employeeId = req.params.id;
    const { rating } = req.body;
    const employee = await employeeModel.findById(employeeId);
    console.log( employee.rating)
    console.log(employee.totalRating)
    console.log(rating);
    // console.log("_____" , employee)
    // console.log(rating)
    // console.log("____", employee.rating , employee.totalRating );
    
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    
    employee.rating = ((employee.rating * employee.totalRating) + rating)  / (employee.totalRating + 1);
    employee.totalRating = employee.totalRating + 1;
    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const modifyEmployee = async (req, res) => {
  
  try {
    const employee = await employeeModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send({ message: "Modified Employee", employee });
  } catch (err) {
    handleError(res,err);
  }
}; 
module.exports = { getEmployee, createEmployee, getEmployeeByID , updateEmployee , modifyEmployee};
