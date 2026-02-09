import request from "supertest";
import app from "../app.js";

describe("Auth flow", () => {
  const userData = {
    name: "Test User",
    email: "test@example.com",
    password: "examplepass",
  };

  it("should register a user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send(userData);

    expect(res.statusCode).toBe(201);
  });

  it("should login a user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/auth")
      .send({ email: userData.email, password: userData.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
