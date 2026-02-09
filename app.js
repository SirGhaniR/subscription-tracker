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
import helmet from "helmet";
import cors from "cors";
import pino from "pino";
import logger from "./utils/logger.js";
import { pinoHttp } from "pino-http";

const app = express();

// the order is: parsing, security, routes, error handling
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(cookieParser());

app.use(
  pinoHttp({
    logger,
  }),
);

app.use(helmet());
app.use(cors()); // in production, dont forget to restrict CORS to the frontend domain (if there are frontend huhu)
app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);

app.use((req, res, next) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
  next();
});

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
