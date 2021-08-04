const express = require("express");
const router = express.Router();

const apiResponse = require("../../../utils/apiResponse");
const Restaurant = require("../../../models/Restaurant");
const auth = require("../../../middleware/auth");

// @route GET /api/restaurant/v1/__test
// @desc Test route
// @access PUBLIC
router.get("/__test", (req, res) =>
  apiResponse.successResponse(res, "restaurant routes working :)")
);

// @route GET /api/restaurant/v1/
// @desc Get Restaurants
// @access Private
router.get("/", async (req, res) => {
  try {
    let { name, weekday, openAt } = req.query;
    let query = {};
    if (name) {
      query.name = new RegExp(name);
    }
    if (weekday && openAt) {
      query["timings.weekday"] = parseInt(weekday);
      query["timings.open"] = { $lt: parseInt(openAt) };
      query["timings.close"] = { $gt: parseInt(openAt) };
      console.log({ weekday, openAt });
    }
    const restaurants = await Restaurant.find(query).sort({ date: -1 });
    return apiResponse.successResponseWithData(
      res,
      "restraunts list",
      restaurants
    );
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, "Server Error");
  }
});

module.exports = router;
