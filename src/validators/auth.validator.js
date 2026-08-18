import {
  isMeaningfulString,
  badRequestError,
  validationError,
} from "../utils/validation.js";

const ALLOWED_FIELDS = ["username", "password"];

export const validateLogin = (req, res, next) => {
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

  if (!isMeaningfulString(body.username)) {
    return next(validationError("Username is required."));
  }

  if (!isMeaningfulString(body.password)) {
    return next(validationError("Password is required."));
  }

  next();
};
