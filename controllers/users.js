const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  UNAUTHORIZED_STATUS,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
    .status(BAD_REQUEST_STATUS_CODE)
    .send({ message: "Email and password are required"});
  }
  return User.findUserByCredentials({ email, password})
  .then((user) => {
    const token = jwt.sign({ _id: user._id}, JWT_SECRET,
    {
      expiresIn: "7d",
    });
    return res.send({ token });
  })
  .catch((err) => {
    console.error(err);
    if (err.message === "Incorrect email or password") {
      return res
      .status(UNAUTHORIZED_STATUS)
      .send({ message: "Incorrect email or password"});
    }
    return res
    .status(SERVER_ERROR_STATUS_CODE)
    .send({ message: "An error occured with the server"})
  });
}


const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Requested resource not found" });
      }

      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occured on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Email and password are required" });
  }
  return User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res
        .status(CONFLICT_STATUS_CODE)
        .send({ message: "This email already exists" });
    }
    return bcrypt
      .hash(password, 10)
      .then((hash) =>
        User.create({
          name,
          avatar,
          email,
          password: hash,
        })
      )
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          return res
            .status(BAD_REQUEST_STATUS_CODE)
            .send({ message: "An error has occured on the server." });
        }
        if (err.code === 11000) {
          return res
            .status(CONFLICT_STATUS_CODE)
            .send({ message: "This email already exists" });
        }
        return res
          .status(SERVER_ERROR_STATUS_CODE)
          .send({ message: "An error has occured on the server." });
      });
  });
};

const getCurrentUser = (req, res) => {
  const { userID } = req.params;
  User.findById(userID)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Requested resource not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "An error has occured on the server." });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occured on the server." });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const { userID } = req.params;
  User.findByIdAndUpdate(
    userID,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Requested resource not found " });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Validation failed" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateUser };
