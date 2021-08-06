const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

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

// @route GET /api/restrauntcollection/v1/
// @desc get collections for signed in User
// @access PRIVATE
router.get("/",auth, async (req,res) => {
  try {
    const restCollection = await RestaurantCollection.find({
      user: req.user.id,
    })
      .populate("restaurants")
      .sort({ date: -1 });
    console.log(JSON.stringify(restCollection));
    return apiResponse.successResponseWithData(res,"fetched collections",restCollection);
  } catch (err) { 
    console.log(err);
    return apiResponse.ErrorResponse(res, "Server Error");
  }
});


// @route POST /api/restrauntcollection/v1/
// @desc creates new collection for signed in User
// @access PRIVATE
router.post(
  "/",
  auth,
  [check("name", "Name is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.errors);
      return apiResponse.validationError(res, errors.array());
    }

    const { name, restaurants } = req.body;
    console.log({ restaurants });
    try {
      let restCollection = await RestaurantCollection.findOne({
        name: name,
      });
      if (restCollection) {
        return apiResponse.validationError(res, [
          { msg: "Name already exists" },
        ]);
      }
      restCollection = new RestaurantCollection({
        name: name,
        user: req.user.id,
        restaurants: restaurants,
      });

      restCollection = await restCollection.save();

      return apiResponse.successResponseWithData(
        res,
        "Succesfull created Restraunt Collection",
        restCollection
      );
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, "Server Error");
    }
  }
);

// @route    DELETE /api/restrauntcollection/v1/:id
// @desc     Delete a post with id
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const restCollection = await RestaurantCollection.findById(req.params.id);

    if (!restCollection) {
      return apiResponse.notFoundResponse(res, "Post not found");
    }

    // Check user
    if (restCollection.user.toString() !== req.user.id) {
      return apiResponse.unauthorizedResponse(res, "User not authorized");
    }

    await restCollection.remove();

    res.json({ msg: "Restraunt collection removed" });
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, "Server Error");
  }
});

// @route    PUT /api/restrauntcollection/v1/:id
// @desc     replace/update a collection
// @access   Private
router.put(
  "/:id/",
  auth,
  [
    check("name", "Name is required").not().isEmpty(),
    check("restaurants", "list should not be empty").not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.errors);
      return apiResponse.validationError(res, errors.array());
    }
    const { name, restaurants } = req.body;
    console.log({restaurants});
    try {
      let restCollection = await RestaurantCollection.findById(req.params.id);
      if (!restCollection) {
        return apiResponse.notFoundResponse(res, "Post not found");
      }
      // Check user
      if (restCollection.user.toString() !== req.user.id) {
        return apiResponse.unauthorizedResponse(res, "User not authorized");
      }
      restCollection.name = name;
      restCollection.restaurants = restaurants;
      restCollection = await restCollection.save();

      return apiResponse.successCreatedResponseData(res, "Succesfull updated Restraunt Collection",restCollection);
    } catch (err) {
      console.log(err);
      return apiResponse.ErrorResponse(res, "Server Error");
    }
  }
);

module.exports = router;
