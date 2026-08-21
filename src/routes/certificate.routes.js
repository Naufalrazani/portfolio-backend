import { Router } from "express";

import {
  createCertificate,
  deleteCertificate,
  deleteCertificateImage,
  getCertificateById,
  getCertificates,
  updateCertificate,
  uploadCertificateImage,
} from "../controllers/certificate.controller.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware.js";
import { uploadEntityImageFile } from "../middlewares/upload.js";
import {
  validateCreateCertificate,
  validateCertificateId,
  validateUpdateCertificate,
} from "../validators/certificate.validator.js";

const router = Router();

router.get("/certificates", optionalAuthenticate, getCertificates);

router.post(
  "/certificates",
  authenticate,
  validateCreateCertificate,
  createCertificate,
);

router.get(
  "/certificates/:id",
  authenticate,
  validateCertificateId,
  getCertificateById,
);

router.patch(
  "/certificates/:id",
  authenticate,
  validateCertificateId,
  validateUpdateCertificate,
  updateCertificate,
);

router.delete(
  "/certificates/:id",
  authenticate,
  validateCertificateId,
  deleteCertificate,
);

router.post(
  "/certificates/:id/image",
  authenticate,
  validateCertificateId,
  uploadEntityImageFile,
  uploadCertificateImage,
);

router.delete(
  "/certificates/:id/image",
  authenticate,
  validateCertificateId,
  deleteCertificateImage,
);

export default router;
