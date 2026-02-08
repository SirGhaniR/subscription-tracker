import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { validate } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/logout", logout);

export default authRouter;
