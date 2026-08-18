import { Router } from "express";

import {
  createProject,
  deleteProject,
  getProjects,
  getProjectByParam,
  publishProject,
  unpublishProject,
  updateProject,
} from "../controllers/project.controller.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware.js";
import {
  validateCreateProject,
  validateProjectId,
  validateUpdateProject,
} from "../validators/project.validator.js";

const router = Router();

router.get("/projects", optionalAuthenticate, getProjects);

router.get("/projects/:param", optionalAuthenticate, getProjectByParam);

router.post(
  "/projects",
  authenticate,
  validateCreateProject,
  createProject,
);

router.patch(
  "/projects/:id",
  authenticate,
  validateProjectId,
  validateUpdateProject,
  updateProject,
);

router.delete(
  "/projects/:id",
  authenticate,
  validateProjectId,
  deleteProject,
);

router.patch(
  "/projects/:id/publish",
  authenticate,
  validateProjectId,
  publishProject,
);

router.patch(
  "/projects/:id/unpublish",
  authenticate,
  validateProjectId,
  unpublishProject,
);

export default router;
