const bookingModel = require("../models/bookingModels");
const moment = require('moment');
const employeeModel = require("../models/employeeModels");
const hourModels = require("../models/hourModels");

const allBooking = async (req, res) => {
  try {
    const { date, hour, employee, id, month , currentPage , limit , status} = req.query;
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const maxNumberRecords = 60;
    const limitt = parseInt(limit)
    const skip = (parseInt(currentPage) - 1) * limitt ;

    const filter = {};
    if (hour) {
      filter.hours_id = hour;
    }
    if (employee) {
      filter.employee_id = employee;
    }
    if (date) {
      filter.date = formattedDate;
    }
    if (id) {
      filter.user_id = id;
    }

    if (status) {
      filter.status = status;
    }
    
    const time = moment(formattedDate);
    const daysInMonth = moment(formattedDate).daysInMonth();
    const dates = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${time.year()}-${time.month() + 1}-${i}`;
      const day = moment(dateString).format('YYYY-MM-DD');
      dates.push(day);
    }

    const bookingsData = await Promise.all([
      bookingModel
        .find(filter)
        .populate("employee_id user_id user_google_id hours_id")
        .skip(skip)
        .limit(limitt)
        .exec(),
    
      bookingModel
        .find({ ...filter, status: { $in: [1, 2] } })
        .populate("employee_id user_id user_google_id hours_id")
        .skip(skip)
        .limit(limitt)
        .exec(),
    
      bookingModel
        .find({ ...filter, status: { $in: [3, 4] } })
        .populate("employee_id user_id user_google_id hours_id")
        .skip(skip)
        .limit(limitt)
        .exec(),

      bookingModel
      .find({ ...filter, status: { $in: 3}})
      .populate("employee_id user_id user_google_id hours_id")
      .skip(skip)
      .limit(limitt)
      .exec(),

      bookingModel
      .find({ ...filter, status: { $in: 4}})
      .populate("employee_id user_id user_google_id hours_id")
      .skip(skip)
      .limit(limitt)
      .exec(),
    ]);
    
    const [all, byStatus12, byStatus34, byStatus3 , byStatus4] = bookingsData;
      
    const Bookings = await bookingModel.countDocuments(filter);
    const BookingsByStatus12 = await bookingModel.countDocuments({...filter, status : { $in: [1,2]}});
    const BookingsByStatus3 = await bookingModel.countDocuments({...filter, status : { $in: 3}});
    const BookingsByStatus4 = await bookingModel.countDocuments({...filter, status : { $in: 4}});
    const totalPage = Math.ceil(Bookings / limitt);
    const totalPage12 = Math.ceil(BookingsByStatus12 / limitt);
    const totalPage3 = Math.ceil(BookingsByStatus3 / limitt);
    const totalPage4 = Math.ceil(BookingsByStatus4 / limitt);
    const pagePosition = parseInt(currentPage)

    const unAvailableDate = await Promise.all(
      dates.map(async (date) => {
        const records = bookingModel
          .find({
            date,
            status: { $nin: 4 }
          })
          .exec();
        return {
          dateId: date ,
          unAvailableDates:
            Number((await records).length) >= Number(maxNumberRecords),
        };
      })
    );  

    res.json({ 
      bookings: {all, byStatus12, byStatus34, byStatus3 , byStatus4}, 
      unAvailableDate, 
      total: {Bookings , BookingsByStatus12, BookingsByStatus3, BookingsByStatus4 },
      totalPage:{totalPage, totalPage12, totalPage3, totalPage4 }, 
      pagePosition });
  } catch (err) {
    res.status(500).send(err);
  }
};

const createBooking = async (req, res) => {
  const booking = new bookingModel(req.body);
  
  try {
    await booking.save();
    res.send(booking);
  } catch (error) {
    res.status(500).send(error);
  }
};

const BookingById = async (req, res) => {
  const bookingByID = await bookingModel.find({ _id: req.params.id });
  try {
    res.send(bookingByID);
  } catch (err) {
    res.status(500).send(err);
  }
};

const modifyBooking = async (req, res) => {
  const booking = await bookingModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.send(booking);
};

const deleteBooking = async (req, res) => {
  const booking = await bookingModel.findByIdAndDelete(req.params.id);
  res.send(booking);
};

const authenticated = async (req, res) => {
  res.status(200).send("Authorized");
};

module.exports = {
  allBooking,
  BookingById,
  createBooking,
  modifyBooking,
  deleteBooking,
  authenticated
};
