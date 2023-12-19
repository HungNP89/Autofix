const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const route = require("./routes/index");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
//const MongoStore = require("connect-mongo")(session);
const app = express();
app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
dotenv.config();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
mongoose
  .connect(`mongodb://localhost:27017/carFixBooking`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

route(app);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
