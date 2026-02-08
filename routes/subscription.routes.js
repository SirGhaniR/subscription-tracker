import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import {
  getAllSubscriptions,
  getUserSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", authorize, getAllSubscriptions);

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

subscriptionRouter.get("/:id", authorize, getSubscription);
subscriptionRouter.post("/", authorize, createSubscription);
subscriptionRouter.put("/:id", authorize, updateSubscription);
subscriptionRouter.delete("/:id", authorize, deleteSubscription);
subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);

export default subscriptionRouter;
