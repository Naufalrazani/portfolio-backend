import { Router } from "express";

import {
  createEducation,
  deleteEducation,
  getEducationById,
  getEducation,
  updateEducation,
} from "../controllers/education.controller.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware.js";
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

export default router;
