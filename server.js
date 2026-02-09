import app from "./app.js";
import connectToDatabase from "./database/mongodb.js";
import { PORT } from "./config/env.js";

async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(
      `Subscription Tracker is runnning on https://localhost:${PORT}`,
    );
  });
}

startServer();
