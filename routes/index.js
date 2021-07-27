const express = require("express");
const router = express.Router();
const apiResponse = require("../utils/apiResponse");
/* GET home page. */
router.get("/", function(req, res) {
  return apiResponse.successResponse(res, "API WORKING!!HURRAY");
});

module.exports = router;
