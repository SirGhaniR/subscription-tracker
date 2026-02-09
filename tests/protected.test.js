import request from "supertest";
import app from "../app.js";

describe("Protected routes", () => {
  it("should block access without token", async () => {
    const res = await request(app).post("/api/v1/users/me");

    expect(res.statusCode).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });
});
