import { Router } from "express";

import {
  createProfile,
  deleteProfile,
  getProfile,
  updateProfile,
} from "../controllers/profile.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  validateCreateProfile,
  validateUpdateProfile,
} from "../validators/profile.validator.js";

const router = Router();

router.get("/profile", getProfile);

router.post("/profile", authenticate, validateCreateProfile, createProfile);
router.patch("/profile", authenticate, validateUpdateProfile, updateProfile);
router.delete("/profile", authenticate, deleteProfile);

export default router;
