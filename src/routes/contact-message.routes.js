import { Router } from "express";

import {
  createContactMessage,
  getContactMessageById,
  listContactMessages,
  markContactMessageAsRead,
} from "../controllers/contact-message.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { contactMessageRateLimiter } from "../middlewares/rateLimiter.js";
import {
  validateContactMessageId,
  validateCreateContactMessage,
} from "../validators/contact-message.validator.js";

const router = Router();

router.post(
  "/contact-messages",
  contactMessageRateLimiter,
  validateCreateContactMessage,
  createContactMessage,
);

router.get("/contact-messages", authenticate, listContactMessages);

router.get(
  "/contact-messages/:id",
  authenticate,
  validateContactMessageId,
  getContactMessageById,
);

router.patch(
  "/contact-messages/:id/read",
  authenticate,
  validateContactMessageId,
  markContactMessageAsRead,
);

export default router;
