const ClothingItem = require("../models/clothingitem");

const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.user._id);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageURL,
    owner: req.user._id
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "err.message" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Requested resource not found " });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

const updateItem = (req, res) => {
  const { itemID } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemID, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        // find error name
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: err.message });
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Requested resource not found" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemID } = req.params;

  console.log(itemID);
  ClothingItem.findByIdAndDelete(itemID)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: err.message });
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Requested resoruce not found" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

// LIKES  

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      } 
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Requested resource not found" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemID,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      } if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Requested resource not found" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
