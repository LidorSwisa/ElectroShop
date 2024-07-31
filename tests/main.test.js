const request = require("supertest");
const app = require("../app");
const db = require("../database");

describe("GET /api/example", () => {
  it("should respond with a 200 status code", async () => {
    const response = await request(app).get("/api/example");
    expect(response.statusCode).toBe(200);
  });

  it("should respond with the expected content", async () => {
    const response = await request(app).get("/api/example");
    expect(response.body).toEqual({ message: "Hello, world!" });
  });
});
