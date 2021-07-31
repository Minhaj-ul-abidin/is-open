const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const apiResponse = require("../../../utils/apiResponse");
const User = require("../../../models/User");
// @route GET /api/auth/v1/__test
// @desc Test route
// @access PUBLIC
router.get("/__test", (req, res) =>
  apiResponse.successResponse(res, "auth routes working :)")
);

// @route POST /api/auth/v1/signup
// @desc Sign up route
// @access PUBLIC
router.post("/signup", async (req,res) => {
  const { name, email, password, role } = req.body;
  const emailRegex = new RegExp(email);

  try { 
    let user = await User.findOne({
      email:{  $regex : emailRegex, $options : "i"},
      password: {$exists : true} 
    });
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "User already exists" }] });
    }
    const allowedRoles = ["user", "admin"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        errors: [
          { msg: "Only user and moderator role is allowed to signup" },
        ],
      });
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

    return res
      .status(201)
      .json({ success: true, message: "Signup successfully :)" });

  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, "Server Error");
  }


});


module.exports = router;
