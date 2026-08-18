import { Router } from "express";

import {
  createSocialLink,
  deleteSocialLink,
  getSocialLinkById,
  getSocialLinks,
  updateSocialLink,
} from "../controllers/social-link.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  validateCreateSocialLink,
  validateSocialLinkId,
  validateUpdateSocialLink,
} from "../validators/social-link.validator.js";

const router = Router();

router.get("/social-links", getSocialLinks);

router.post(
  "/social-links",
  authenticate,
  validateCreateSocialLink,
  createSocialLink,
);

router.get(
  "/social-links/:id",
  authenticate,
  validateSocialLinkId,
  getSocialLinkById,
);

router.patch(
  "/social-links/:id",
  authenticate,
  validateSocialLinkId,
  validateUpdateSocialLink,
  updateSocialLink,
);

router.delete(
  "/social-links/:id",
  authenticate,
  validateSocialLinkId,
  deleteSocialLink,
);

export default router;
