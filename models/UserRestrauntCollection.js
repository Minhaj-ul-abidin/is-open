const mongoose = require("mongoose");
const Restaurant = require("./Restaurant");
const User = require("./User");
const UserRestrauntCollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  restraunts: [Restaurant],
  user: User,
  date: {
    type: Date,
    default: Date.now,
  },
});
const UserRestrauntCollection = mongoose.model(
  "user_restaurant_collections",
  UserRestrauntCollectionSchema
);
module.exports = UserRestrauntCollection;
