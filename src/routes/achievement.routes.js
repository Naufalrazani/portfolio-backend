import { Router } from "express";

import {
  createAchievement,
  deleteAchievement,
  getAchievementById,
  getAchievements,
  updateAchievement,
} from "../controllers/achievement.controller.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware.js";
import {
  validateCreateAchievement,
  validateAchievementId,
  validateUpdateAchievement,
} from "../validators/achievement.validator.js";

const router = Router();

router.get("/achievements", optionalAuthenticate, getAchievements);

router.post(
  "/achievements",
  authenticate,
  validateCreateAchievement,
  createAchievement,
);

router.get(
  "/achievements/:id",
  authenticate,
  validateAchievementId,
  getAchievementById,
);

router.patch(
  "/achievements/:id",
  authenticate,
  validateAchievementId,
  validateUpdateAchievement,
  updateAchievement,
);

router.delete(
  "/achievements/:id",
  authenticate,
  validateAchievementId,
  deleteAchievement,
);

export default router;
