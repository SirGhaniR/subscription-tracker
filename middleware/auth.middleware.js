import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: {
          code: "AUTH_HEADER_MISSING",
          message: "Authorization header is required",
        },
      });
    }

    if (!authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        error: {
          code: "AUTH_HEADER_INVALID",
          message: "Authorization header must use Bearer scheme",
        },
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: {
          code: "TOKEN_MISSING",
          message: "Authentication token is missing",
        },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({
        error: {
          code: "TOKEN_INVALID",
          message: "Authentication token is invalid or expired",
        },
      });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        error: {
          code: "USER_NOT_FOUND",
          message: "Authenticated user does not exist",
        },
      });
    }

    req.user = user;
    next();
  } catch {
    res.status(500).json({
      error: {
        code: "AUTH_INTERNAL_ERROR",
        message: "An unexpected auth internal error occurred",
      },
    });
  }
};

export default authorize;
