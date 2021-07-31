const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const apiResponse = require("../../../utils/apiResponse");
const User = require("../../../models/User");


// @route GET /api/auth/v1/__test
// @desc Test route
// @access PUBLIC
router.get("/__test", (req, res) =>
  apiResponse.successResponse(res, "auth routes working :)")
);

// @route POST /api/auth/v1/login
// @desc login with email and password
// @access PUBLIC
router.post(
  "/login",
  [
    check("email").isEmail(),
    check("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long")
      .matches(/\d/)
      .withMessage("must contain a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if ( !errors.isEmpty()) {
      return apiResponse.validationError(res, errors.array());
    }
    const { email, password } = req.body;
    // Check if user exists
    try {
      let user = await User.findOne({ email });

      if (!user) {
        return apiResponse.validationError(res,[{ msg: "Invalid Credentials" }]);
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return apiResponse.validationError(res,[{ msg: "Invalid Credentials" }]);
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role,
          approved: user.approved,
        },
      };
      console.log(process.env.JWT_SECRET);
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          apiResponse
            .successResponseWithData(res,"Login Success" , {token});
        }
      );
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, "Server Error");
    }
  }
);


// @route POST /api/auth/v1/signup
// @desc Sign up User
// @access PUBLIC
router.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long")
      .matches(/\d/)
      .withMessage("must contain a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return apiResponse.validationError(res, errors.array());
    }

    const { name, email, password, role } = req.body;
    const emailRegex = new RegExp(email);

    try {
      let user = await User.findOne({
        email: { $regex: emailRegex, $options: "i" },
        password: { $exists: true },
      });
      if (user) {
        return apiResponse.validationError(res,[{msg:"User already exists"}]);
      }
      const allowedRoles = ["user", "admin"];
      if (role && !allowedRoles.includes(role)) {
        return apiResponse.validationError(res,
          [
            { msg: "Only user and moderator role is allowed to signup" },
          ]
        );
      }
      const userRole = role ? role : "user";
      const approved = role === "user" ? true : false;
      user = new User({
        name: name,
        role: userRole,
        approved: approved,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      user = await user.save();

      return apiResponse.successCreatedResponse(res, "Succesfull sign up!");
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, "Server Error");
    }
  }
);


module.exports = router;
