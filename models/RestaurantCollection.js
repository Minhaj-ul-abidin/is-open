const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RestrauntCollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  restraunts: [{ type: Schema.Types.ObjectId, ref: "restaurants" }],
  user: { type: Schema.Types.ObjectId, ref: "users" },
  date: {
    type: Date,
    default: Date.now,
  },
});

const RestaurantCollection = mongoose.model(
  "restaurant_collections",
  RestrauntCollectionSchema
);
module.exports = RestaurantCollection;
