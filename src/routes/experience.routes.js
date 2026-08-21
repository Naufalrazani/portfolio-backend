import { Router } from "express";

import {
  createExperience,
  deleteExperience,
  deleteExperienceImage,
  getExperienceById,
  getExperiences,
  updateExperience,
  uploadExperienceImage,
} from "../controllers/experience.controller.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware.js";
import { uploadEntityImageFile } from "../middlewares/upload.js";
import {
  validateCreateExperience,
  validateExperienceId,
  validateUpdateExperience,
} from "../validators/experience.validator.js";

const router = Router();

router.get("/experiences", optionalAuthenticate, getExperiences);

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

router.post(
  "/experiences/:id/image",
  authenticate,
  validateExperienceId,
  uploadEntityImageFile,
  uploadExperienceImage,
);

router.delete(
  "/experiences/:id/image",
  authenticate,
  validateExperienceId,
  deleteExperienceImage,
);

export default router;
