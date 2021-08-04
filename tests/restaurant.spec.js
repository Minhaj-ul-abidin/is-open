const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const should = require("should");

var authtoken = null;

beforeAll(async () => {
  console.log("Creating test user 2 for duplication test");
  let user = new User({
    name: "Test user",
    email: "test2@test.com",
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
    name: "testres1",
    timings: [
      { weekday: 1, open: 600, close: 2100 },
      { weekday: 2, open: 700, close: 2000 },
    ],
  };
  const restaurant2 = {
    name: "testres2",
    timings: [
      { weekday: 1, open: 600, close: 2100 },
      { weekday: 3, open: 800, close: 1800 },
    ],
  };
  const test_restaurants = await Restaurant.insertMany([
    restaurant1,
    restaurant2,
  ]);
  console.log({ test_restaurants });
});

afterAll(async () => {
  await User.deleteMany({ email: "testrestaurant@test.com" });
  console.log("deleting restaurants!!");
  await Restaurant.deleteMany({ name: { $in: ["testres1", "testres2"] } });
});
//  TESTS START

describe("Test Restaurant route", () => {
  test("should respond", async () => {
    await request(app).get("/api/restaurant/v1/__test").expect(200);
  });
});

describe("Test for fetching restaurants", () => {
  
  test("should return restaurants", async () => {
    await request(app)
      .get("/api/restaurant/v1/")
      .expect(200)
      .expect((res) => {
        should.exist(res.body.data);
        should.ok(res.body.data.length);
      });
  });

  test("should return restaurant with name containing testres1", async () => {
    await request(app)
      .get("/api/restaurant/v1/")
      .set("x-auth-token", authtoken)
      .query({ name: "testres1" })
      .expect(200)
      .expect((res) => {
        should.exist(res.body.data);
        should.equal(res.body.data.length, 1);
        should.strictEqual(res.body.data[0].name, "testres1");
      });
  });
  test("should return restraunts open on monday at 0730  ", async () => {
    await request(app)
      .get("/api/restaurant/v1/")
      .set("x-auth-token", authtoken)
      .query({ weekday: 2, openAt: 730 })
      .expect(200)
      .expect((res) => {
        should.exist(res.body.data);
        should.equal(res.body.data.length, 1);
      });
  });
});
