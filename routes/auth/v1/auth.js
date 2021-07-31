const express = require("express");
const router = express.Router();
const apiResponse = require("../../../utils/apiResponse");
// @route GET /api/auth/v1/__test
// @desc Test route
// @access PUBLIC
router.get("/__test", (req, res) =>
  apiResponse.successResponse(res, "auth routes working :)")
);
module.exports = router;
