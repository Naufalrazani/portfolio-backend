import { Router } from "express";

import {
  createSkill,
  deleteSkill,
  getSkillById,
  getSkills,
  updateSkill,
} from "../controllers/skill.controller.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware.js";
import {
  validateCreateSkill,
  validateSkillId,
  validateUpdateSkill,
} from "../validators/skill.validator.js";

const router = Router();

router.get("/skills", optionalAuthenticate, getSkills);

router.post("/skills", authenticate, validateCreateSkill, createSkill);

router.get("/skills/:id", authenticate, validateSkillId, getSkillById);

router.patch(
  "/skills/:id",
  authenticate,
  validateSkillId,
  validateUpdateSkill,
  updateSkill,
);

router.delete("/skills/:id", authenticate, validateSkillId, deleteSkill);

export default router;
