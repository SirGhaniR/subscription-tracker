import request from "supertest";
import dayjs from "dayjs";
import app from "../app.js";

describe("Subscriptions", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "examplepass" });
    token = res.body.token;
  });

  it("should create a subscription", async () => {
    const res = await request(app)
      .post("/api/v1/subscriptions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Netflix",
        price: 150000,
        frequency: "monthly",
        category: "entertainment",
        paymentMethod: "credit card",
        startDate: dayjs().toISOString(),
      });

    expect(res.statusCode).toBe(201);
  });
});
