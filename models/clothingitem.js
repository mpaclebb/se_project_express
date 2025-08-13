const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not Valid",
    },
  },

  owner: {
    //owner - a link to the item author's model of the ObjectID type, a required field
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", 
  },
  likes: {
    //like - a list of users who liked the item, an ObjectID array with a reference to the user modal (empty by default)
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },

  createdAt: {
    // createdAt - the item creation date, a field with the data type and the default value Date.now
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItems", clothingItem);
