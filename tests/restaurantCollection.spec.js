const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const RestaurantCollection = require("../models/RestaurantCollection");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const should = require("should");

var authtoken = null;
var user = null;
var test_restaurants = null;
var test_collection = null;
beforeAll(async () => {
  console.log("Creating test user 2 for duplication test");
  user = new User({
    name: "Test user",
    email: "testrestaurantcollection@test.com",
    password: "test1234",
    role: "user",
    approved: true,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash("test1234", salt);
  user = await user.save();
  const payload = {
    user: {
      id: user.id,
      role: user.role,
      approved: user.approved,
    },
  };
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "5 days" },
    (err, token) => {
      if (err) throw err;
      authtoken = token;
    }
  );
  console.log(user);
  const restaurant1 = {
    name: "res1",
    timings: [
      { weekday: 5, open: 600, close: 2100 },
      { weekday: 6, open: 700, close: 2000 },
    ],
  };
  const restaurant2 = {
    name: "res2",
    timings: [
      { weekday: 7, open: 600, close: 2100 },
      { weekday: 4, open: 800, close: 1800 },
    ],
  };
  test_restaurants = await Restaurant.insertMany([restaurant1, restaurant2]);
  console.log({ test_restaurants });
});

afterAll(async () => {
  await User.deleteMany({ email: "testrestaurantcollection@test.com" });
  console.log("deleting restaurants!!");
  await Restaurant.deleteMany({ name: { $in: ["res1", "res2"] } });
  await RestaurantCollection.deleteMany({ name: "test_collection" });
});



//  TESTS START

describe("Test Restaurant Collection route", () => {
  test("should respond", async () => {
    await request(app).get("/api/restaurantcollection/v1/__test").expect(200);
  });
});

describe("Test creating restaurant collection", () => {
  test("Should create a restaurant collection", async () => {
    await request(app)
      .post("/api/restaurantcollection/v1/")
      .set("x-auth-token", authtoken)
      .send({
        name: "test_collection",
        restaurants: test_restaurants.map((rest) => rest._id),
      })
      .expect(201);

    let rest = await RestaurantCollection.find(
      { name: "test_collection" },
      "id"
    );
    test_collection = rest; // used in delete test
    should.exist(rest);
  });

  test("should validate for body for restaurant collection", async () => {
    await request(app)
      .post("/api/restaurantcollection/v1/")
      .set("x-auth-token", authtoken)
      .send({})
      .expect(400);
  });
  test("should validate for duplicate entry in restaurant collection", async () => {
    await request(app)
      .post("/api/restaurantcollection/v1/")
      .set("x-auth-token", authtoken)
      .send({
        name: "test_collection",
        restaurants: test_restaurants.map((rest) => rest._id),
      })
      .expect(400);
  });
});

