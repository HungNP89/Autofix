const userModel = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
const { roles } = require("../auth/accessControl");
const googleUserModel = require("../models/googleUserModels");
dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      phone: user.phone,
      role: user.role,
    },
    process.env.SECRET_TOKEN,
    { expiresIn: "1d" }
  );
};
const generateTokenGoogle = (userGoogle) => {
  return jwt.sign(
    {
      _id: userGoogle._id,
      name: userGoogle.name,
      email: userGoogle.email,
      role: userGoogle.role,
    },
    process.env.SECRET_TOKEN,
    { expiresIn: "1d" }
  );
};
const handleError = (res, err) => {
  console.error(err);
  res.status(500).send({ error: "Internal Server Error" });
};

const allUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    const userGoogle = await googleUserModel.find();
    res
      .status(200)
      .send({ message: "Access Granted ,get All Users", users, userGoogle });
  } catch (err) {
    handleError(res, err);
  }
};

const singleUser = async (req, res) => {
  const userByID = await userModel.find({ _id: req.params.id });
  try {
    res.status(200).send({ message: "Get User By ID", userByID });
  } catch (err) {
    handleError(res, err);
  }
};

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const existingPhone = await userModel.findOne({phone: req.body.phone});
  if (existingPhone) {
    return res.status(400).json({mesage: "Existing Phone No" , existPhone: true});
  }

  const existingUsername = await userModel.findOne({ username: req.body.username });
  if(existingUsername) {
    return res.status(400).json({message:"Existing Username" , existUsername: true});
  }

  const hashPassword = await bcrypt.hash(req.body.password, 12);
  const users = new userModel({
    username: req.body.username,
    password: hashPassword,
    phone: req.body.phone,
    role: req.body.role || "user",
  });
  await users.save();
  const token = generateToken(users);
  res.status(201).send({ message: "Create User", users, token , existPhone: false , existUsername: false  });
};

const googleRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, name } = req.query;
    if (!email || !name) {
      return res
        .status(400)
        .json({ message: "Both email and name are required parameters" });
    }

    const existingUser = await googleUserModel.findOne({ email });

    if (!existingUser) {
      const createNew = new googleUserModel({
        email,
        name,
        role: "user",
      });
      await createNew.save();
      const tokenForNew = generateTokenGoogle(createNew);
      return res.status(200).json({
        message: "Create Google User",
        createNew,
        tokenForNew,
        isNewUser: true,
      });
    } else {
      const token = generateTokenGoogle(existingUser);
      res
        .status(200)
        .send({ message: "Welcome", existingUser, token, isNewUser: false });
    }
  } catch (err) {
    handleError(res, err);
  }
};

const modifyUser = async (req, res) => {
  try {
    const users = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send({ message: "Modified User", users });
  } catch (err) {
    handleError(res, err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const users = await userModel.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Deleted User", users });
  } catch (err) {
    handleError(res, err);
  }
};

const login = async (req, res) => {
  try {
    const users = await userModel.findOne({ username: { $regex: new RegExp(`^${req.body.username}$`, 'i') } });
    if (users) {
      const result = await bcrypt.compare(req.body.password, users.password);
      if (result) {
        const token = generateToken(users);
        res.status(200).send({ message: "Login Success", users, token });
      } else {
        res.status(401).send({ message: "Login Failed" });
      }
    } else {
      res.status(401).send({ message: "Login Failed" });
    }
  } catch (err) {
    handleError(res, err);
  }
};

const googleLogin = async (req, res) => {
  try {
    const { email, name } = req.query;
    const names = await googleUserModel.findOne({ email, name });
    if (names) {
      const token = generateTokenGoogle(names);
      res.status(200).send({ message: "Login Success", names, token });
    } else {
      res.status(401).send({ message: "Login Failed" });
    }
  } catch (err) {
    handleError(res, err);
  }
};
const authenticated = async (req, res) => {
  res.status(200).send("Authorized");
};

module.exports = {
  allUsers,
  createUser,
  singleUser,
  modifyUser,
  deleteUser,
  login,
  authenticated,
  googleRegister,
  googleLogin,
};
