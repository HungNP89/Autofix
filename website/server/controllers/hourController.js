const hoursModel = require("../models/hourModels");
const moment = require('moment');
const bookingModel = require("../models/bookingModels");
const employeeModel = require("../models/employeeModels");
const getHours = async (req, res) => {
  try {
    const { id , date } = req.query;
    const formattedDate = moment(date).format('YYYY-MM-DD');
    console.log(formattedDate);

    const numberOfEmployees = 10;
    const filteredHours = {};
    if(id) {
      filteredHours._id = id;
    }
    const hours = await hoursModel.find(filteredHours);

    const unAvailableHours = await Promise.all(
      hours.map(async (hour) =>{
        const booking = bookingModel.find({
          date: formattedDate,
          hours_id: hour._id,
          status: { $nin: 4 }
        }).exec();
        console.log((await booking).length);
        return {
          hourId: hour._id,
          date: formattedDate,
          unAvailable: Number((await booking).length) >= Number(numberOfEmployees)
        }
      })
    )
    
    console.log(unAvailableHours);
    res.send( {hours,unAvailableHours} );
  } catch (err) {
    res.status(500).send(err);
  }
};

const createHours = async (req, res) => {
    try {
        const hours = await hoursModel.create(req.body);
        res.send(hours);
    } catch (err) {
        res.status(500).send(err);
    }
}

const getHoursById = async (req, res) => {
  const hours = await hoursModel.find({_id :req.params.id});
  try {
    res.send(hours);
  } catch (err) {
    res.status(500).send(err);
  }
}

const modifyHour = async (req, res) => {
  
  try {
    const hours = await hoursModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send({ message: "Modified Hour", hours });
  } catch (err) {
    handleError(res,err);
  }
}; 
module.exports = {getHours, createHours , getHoursById , modifyHour};














