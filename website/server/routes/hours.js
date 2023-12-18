const express = require('express');
const { getHours , createHours , getHoursById , modifyHour } = require('../controllers/hourController');

const route = express.Router();

route.get('/shifts', getHours);
route.post('/createS', createHours);
route.get('/shifts/:id', getHoursById);
route.put('/shifts/:id', modifyHour);

module.exports = route;