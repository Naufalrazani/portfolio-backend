import { Router } from "express";

import { login } from "../controllers/auth.controller.js";
import { loginRateLimiter } from "../middlewares/rateLimiter.js";
import { validateLogin } from "../validators/auth.validator.js";

const router = Router();

router.post("/auth/login", loginRateLimiter, validateLogin, login);

export default router;
