const adminRoute = require('./admin');
const userRoute = require('./users');
const hourRoute = require('./hours');
const employeeRoute = require('./employee');
const bookingRoute = require('./booking');

const route = (app) => {
    app.use('/admin', adminRoute);
    app.use('/user', userRoute);
    app.use('/hour', hourRoute);
    app.use('/employee', employeeRoute);
    app.use('/booking', bookingRoute);
}

module.exports = route;