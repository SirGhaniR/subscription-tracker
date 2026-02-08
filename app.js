import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import workflowRouter from "./routes/workflow.routes.js";

import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);

app.use(errorMiddleware);

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "OK" });
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Subscription Tracker API!" });
});

await connectToDatabase();
app.listen(PORT, async () => {
  console.log(`Subscription Tracker is runnning on https://localhost:${PORT}`);
});

export default app;
