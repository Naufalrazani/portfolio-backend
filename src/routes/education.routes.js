import { Router } from "express";

import {
  createEducation,
  deleteEducation,
  deleteEducationImage,
  getEducationById,
  getEducation,
  updateEducation,
  uploadEducationImage,
} from "../controllers/education.controller.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware.js";
import { uploadEntityImageFile } from "../middlewares/upload.js";
import {
  validateCreateEducation,
  validateEducationId,
  validateUpdateEducation,
} from "../validators/education.validator.js";

const router = Router();

router.get("/education", optionalAuthenticate, getEducation);

router.post(
  "/education",
  authenticate,
  validateCreateEducation,
  createEducation,
);

router.get(
  "/education/:id",
  authenticate,
  validateEducationId,
  getEducationById,
);

router.patch(
  "/education/:id",
  authenticate,
  validateEducationId,
  validateUpdateEducation,
  updateEducation,
);

router.delete(
  "/education/:id",
  authenticate,
  validateEducationId,
  deleteEducation,
);

router.post(
  "/education/:id/image",
  authenticate,
  validateEducationId,
  uploadEntityImageFile,
  uploadEducationImage,
);

router.delete(
  "/education/:id/image",
  authenticate,
  validateEducationId,
  deleteEducationImage,
);

export default router;
