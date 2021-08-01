const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  timings: [
    {
      weekday: Number,
      open: Number,
      close: Number,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});
const Restaurant = mongoose.model("restaurants", RestaurantSchema);
module.exports = Restaurant;
