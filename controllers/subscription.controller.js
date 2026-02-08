import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

const checkOwnership = (reqUserId, resourceUserId) => {
  if (reqUserId.toString() !== resourceUserId.toString()) {
    const error = new Error("Forbidden");
    error.statusCode = 403;
    throw error;
  }
};

const notFound = (resource) => {
  if (!resource) {
    const error = new Error(`Not found`);
    error.statusCode = 404;
    throw error;
  }
};

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find().populate(
      "user",
      "name email",
    );
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    const subscription = await Subscription.find({ user: req.params.id });
    if (!subscription.length) {
      const error = new Error("No subscriptions found for this user");
      error.statusCode = 404;
      throw error;
    }
    if (req.user._id.toString() !== req.params.id) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    notFound(subscription);
    checkOwnership(req.user._id, subscription.user);

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/workflows/subscription/reminder`,
      body: { subscriptionId: subscription._id },
      headers: { "content-type": "application/json" },
      retries: 0,
    });

    res.status(201).json({
      success: true,
      data: { subscription, workflowRunId },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    notFound(subscription);
    checkOwnership(req.user._id, subscription.user);

    Object.assign(subscription, req.body);
    await subscription.save();

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    notFound(subscription);
    checkOwnership(req.user._id, subscription.user);

    await subscription.remove();

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    notFound(subscription);
    checkOwnership(req.user._id, subscription.user);

    subscription.status = "cancelled";
    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};
