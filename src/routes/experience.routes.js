import { Router } from "express";

import {
  createExperience,
  deleteExperience,
  getExperienceById,
  getExperiences,
  updateExperience,
} from "../controllers/experience.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  validateCreateExperience,
  validateExperienceId,
  validateUpdateExperience,
} from "../validators/experience.validator.js";

const router = Router();

router.get("/experiences", getExperiences);

router.post(
  "/experiences",
  authenticate,
  validateCreateExperience,
  createExperience,
);

router.get(
  "/experiences/:id",
  authenticate,
  validateExperienceId,
  getExperienceById,
);

router.patch(
  "/experiences/:id",
  authenticate,
  validateExperienceId,
  validateUpdateExperience,
  updateExperience,
);

router.delete(
  "/experiences/:id",
  authenticate,
  validateExperienceId,
  deleteExperience,
);

export default router;
