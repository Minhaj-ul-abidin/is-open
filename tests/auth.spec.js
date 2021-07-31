const request = require("supertest");
const app = require("../app");

beforeEach(async () => {
  console.log("before Each block Ran");
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
});