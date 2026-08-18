import { Router } from "express";

import {
  createProjectImage,
  deleteProjectImage,
  getProjectImageById,
  updateProjectImage,
} from "../controllers/project-image.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  validateCreateProjectImage,
  validateProjectImageId,
  validateUpdateProjectImage,
} from "../validators/project-image.validator.js";

const router = Router();

router.post(
  "/project-images",
  authenticate,
  validateCreateProjectImage,
  createProjectImage,
);

router.get(
  "/project-images/:id",
  authenticate,
  validateProjectImageId,
  getProjectImageById,
);

router.patch(
  "/project-images/:id",
  authenticate,
  validateProjectImageId,
  validateUpdateProjectImage,
  updateProjectImage,
);

router.delete(
  "/project-images/:id",
  authenticate,
  validateProjectImageId,
  deleteProjectImage,
);

export default router;
