const express = require("express");
const router = express.Router();

const apiResponse = require("../../../utils/apiResponse");
const User = require("../../../models/User");
const Restaurant = require("../../../models/Restaurant");
const RestaurantCollection = require("../../../models/RestaurantCollection");

const auth = require("../../../middleware/auth");

// @route GET /api/restrauntcollection/v1/__test
// @desc Test route
// @access PUBLIC
router.get("/__test", (req, res) =>
  apiResponse.successResponse(res, "restaurant collection routes working :)")
);

module.exports = router;
