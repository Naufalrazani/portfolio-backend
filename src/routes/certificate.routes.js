import { Router } from "express";

import {
  createCertificate,
  deleteCertificate,
  getCertificateById,
  getCertificates,
  updateCertificate,
} from "../controllers/certificate.controller.js";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware.js";
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

export default router;
