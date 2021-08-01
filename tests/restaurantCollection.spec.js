const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const RestaurantCollection = require("../models/RestaurantCollection");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const should = require("should");

var authtoken = null;

//  TESTS START

describe("Test Restaurant Collection route", () => {
  test("should respond", async () => {
    await request(app).get("/api/restaurant/v1/__test").expect(200);
  });
});
