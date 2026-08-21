import { Router } from "express";

import {
  createAchievement,
  deleteAchievement,
  deleteAchievementImage,
  getAchievementById,
  getAchievements,
  updateAchievement,
  uploadAchievementImage,
} from "../controllers/achievement.controller.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware.js";
import { uploadEntityImageFile } from "../middlewares/upload.js";
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

router.post(
  "/achievements/:id/image",
  authenticate,
  validateAchievementId,
  uploadEntityImageFile,
  uploadAchievementImage,
);

router.delete(
  "/achievements/:id/image",
  authenticate,
  validateAchievementId,
  deleteAchievementImage,
);

export default router;
