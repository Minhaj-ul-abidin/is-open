const request = require("supertest");
const app = require("../app");
const User = require("../models/User");


beforeEach(async () => {
  console.log("Delete test users");
  await User.deleteMany({ email: "test@test.com" });
});

test("should respond", async () => {
  await request(app).get("/").expect(200);
});

describe("Auth test route", () => {
  test("should be working", async () => {
    await request(app).get("/api/auth/v1/__test").expect(200);
  });
});

describe("Signup API", () => {
  test("Should sign up for a user", async () => {
    await request(app)
      .post("/api/auth/v1/signup")
      .send({
        name: "Test user",
        email: "test@test.com",
        password: "test1234",
      })
      .expect(201);
  });
  test("Should not signup with duplicate email", async () => {
    await request(app)
      .post("/api/auth/v1/signup")
      .send({
        name: "Test user",
        email: "test2@test.com",
        password: "test1234",
      })
      .expect(400);
  });
  test("Should not signup with invalid email", async () => {
    await request(app)
      .post("/api/auth/v1/signup")
      .send({
        name: "Test user",
        email: "test3@test",
        password: "test1234",
      })
      .expect(400);
  });

  test("Should not signup with invalid password", async () => {
    await request(app)
      .post("/api/auth/v1/signup")
      .send({
        name: "Test user",
        email: "test3@test",
        password: "1234",
      })
      .expect(400);
  });
});


describe("Login API", () => {
  test("Should login a user", async () => {
    await User.create({
      name: "Test user",
      email: "test2@test.com",
      password: "test1234",
    });
    await request(app)
      .post("/api/auth/v1/login")
      .send({
        email: "test2@test.com",
        password: "test1234",
      })
      .expect(200);
    await User.deleteMany({
      email: "test2@test.com",
    });
  });

  test("Should not login with wrong email", async () => {
    await request(app)
      .post("/api/auth/v1/login")
      .send({
        email: "test2@test",
        password: "test1234",
      })
      .expect(400);
  });

  test("Should not login with wrong password", async () => {
    await request(app)
      .post("/api/auth/v1/login")
      .send({
        email: "test2@test",
        password: "test123",
      })
      .expect(400);
  });
});