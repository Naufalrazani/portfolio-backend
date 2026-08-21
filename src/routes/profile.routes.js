import { Router } from "express";

import {
  createProfile,
  deleteProfile,
  deleteProfileImage,
  deleteProfileResume,
  getProfile,
  updateProfile,
  uploadProfileImage,
  uploadProfileResume,
} from "../controllers/profile.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  uploadProfileImageFile,
  uploadProfileResumeFile,
} from "../middlewares/upload.js";
import {
  validateCreateProfile,
  validateUpdateProfile,
} from "../validators/profile.validator.js";

const router = Router();

router.get("/profile", getProfile);

router.post("/profile", authenticate, validateCreateProfile, createProfile);
router.patch("/profile", authenticate, validateUpdateProfile, updateProfile);
router.delete("/profile", authenticate, deleteProfile);

router.post("/profile/image", authenticate, uploadProfileImageFile, uploadProfileImage);
router.delete("/profile/image", authenticate, deleteProfileImage);

router.post("/profile/resume", authenticate, uploadProfileResumeFile, uploadProfileResume);
router.delete("/profile/resume", authenticate, deleteProfileResume);

export default router;
