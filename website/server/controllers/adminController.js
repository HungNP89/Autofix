const adminModel = require("../models/adminModels");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      phone: user.phone,
      role: user.role
    },
    process.env.SECRET_TOKEN,
    { expiresIn: "1d" }
  );
};
const handleError = (res, err) => {
  console.error(err);
  res.status(500).send({ error: "Internal Server Error" });
};

const admin = async (req, res) => {
  try {
    const admin = await adminModel.find();
    res.json(admin);
  } catch (err) {
    res.status(500).send(err);
  }
};

const createAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const hashPassword = await bcrypt.hash(req.body.password, 12);
    const admins = new adminModel({
      username: req.body.username,
      password: hashPassword,
    });
    await admins.save();
    const token = generateToken(admins);
    res.status(201).send({ message: "Create User", admins , token });
  } catch (err) {
    handleError(res, err);
  }
};

const adminById = async (req, res) => {
  const adminByID = await adminModel.find({ _id: req.params.id });
  try {
    res.send(adminByID);
  } catch (err) {
    res.status(500).send(err);
  }
};

const modifyAdmin = async (req, res) => {
  const admin = await adminModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(admin);
};

const loginAdmin = async (req, res) => {
  try {
    const admins = await adminModel.findOne({username : req.body.username});
    if (admins) {
      const result = await bcrypt.compare(req.body.password, admins.password);
      if (result) {
        const token = generateToken(admins);
        res.status(200).send({ message: "Login Success", admins , token });
      } else {
        res.status(401).send({ message: "Login Failed" });
      }
    } else {
      res.status(401).send({ message: "Login Failed" });
    }
  } catch (err){
    handleError(res,err);
  }
};

const authenticated = async (req, res) => {
  res.status(200).send("Authorized");
};

const deleteAdmin = async (req, res) => {
  const admin = await adminModel.findByIdAndDelete(req.params.id);
  res.send(admin);
}
module.exports = {admin , createAdmin , adminById , modifyAdmin , deleteAdmin , loginAdmin, authenticated};