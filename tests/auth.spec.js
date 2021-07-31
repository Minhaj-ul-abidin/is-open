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
