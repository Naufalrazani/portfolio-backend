import { isValidUuid } from "../utils/uuid.js";
import {
  isMeaningfulString,
  badRequestError,
  validationError,
} from "../utils/validation.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_FIELDS = ["name", "email", "subject", "message"];

export const validateCreateContactMessage = (req, res, next) => {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return next(badRequestError("Request body must be an object."));
  }

  const unknownField = Object.keys(body).find(
    (field) => !ALLOWED_FIELDS.includes(field),
  );

  if (unknownField) {
    return next(badRequestError(`Unknown field: ${unknownField}.`));
  }

  if (!isMeaningfulString(body.name)) {
    return next(validationError("Name is required."));
  }

  if (!isMeaningfulString(body.email)) {
    return next(validationError("Email is required."));
  }

  if (!EMAIL_PATTERN.test(body.email)) {
    return next(validationError("Email must be a valid email address."));
  }

  if (
    body.subject !== undefined &&
    body.subject !== null &&
    typeof body.subject !== "string"
  ) {
    return next(validationError("Subject must be a string."));
  }

  if (!isMeaningfulString(body.message)) {
    return next(validationError("Message is required."));
  }

  next();
};

export const validateContactMessageId = (req, res, next) => {
  if (!isValidUuid(req.params.id)) {
    return next(badRequestError("Message id must be a valid UUID."));
  }

  next();
};
