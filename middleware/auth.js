const jwt = require("jsonwebtoken");
const apiResponse = require("../utils/apiResponse");
module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return apiResponse.unauthorizedResponse(
      res,
      "No token, authorization denied"
    );
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return apiResponse.unauthorizedResponse(res, "Token is not valid");
      }

      req.user = decoded.user;
      next();
    });
  } catch (error) {
    apiResponse.ErrorResponse(res, "Server Error");
  }
};
