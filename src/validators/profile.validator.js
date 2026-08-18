import {
  isMeaningfulString,
  isValidUrl,
  badRequestError,
  validationError,
} from "../utils/validation.js";

const ALLOWED_FIELDS = [
  "name",
  "headline",
  "bio",
  "location",
  "email",
  "profileImageUrl",
  "resumeUrl",
];

const REQUIRED_FIELDS = ["name", "headline", "bio"];

const REQUIRED_FIELD_LABELS = {
  name: "Name",
  headline: "Headline",
  bio: "Bio",
};

const validateOptionalString = (body, field, label) => {
  const value = body[field];

  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return validationError(`${label} must be a string.`);
  }

  return null;
};

const validateOptionalUrl = (body, field, label) => {
  const value = body[field];

  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return validationError(`${label} must be a string.`);
  }

  if (!isValidUrl(value)) {
    return validationError(`${label} must be a valid URL.`);
  }

  return null;
};

const validateRequiredFieldPresence = (body, next) => {
  for (const field of REQUIRED_FIELDS) {
    if (!isMeaningfulString(body[field])) {
      next(validationError(`${REQUIRED_FIELD_LABELS[field]} is required.`));
      return true;
    }
  }

  return false;
};

const validatePresentFieldValues = (body, next) => {
  for (const field of REQUIRED_FIELDS) {
    if (body[field] !== undefined && !isMeaningfulString(body[field])) {
      next(
        validationError(`${REQUIRED_FIELD_LABELS[field]} must be a non-empty string.`),
      );
      return true;
    }
  }

  return false;
};

const validateOptionalFields = (body, next) => {
  const optionalChecks = [
    validateOptionalString(body, "location", "Location"),
    validateOptionalString(body, "email", "Email"),
    validateOptionalUrl(body, "profileImageUrl", "Profile image URL"),
    validateOptionalUrl(body, "resumeUrl", "Resume URL"),
  ];

  for (const error of optionalChecks) {
    if (error) {
      next(error);
      return true;
    }
  }

  return false;
};

const validateBodyStructure = (req, res, next) => {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    next(badRequestError("Request body must be an object."));
    return null;
  }

  const unknownField = Object.keys(body).find(
    (field) => !ALLOWED_FIELDS.includes(field),
  );

  if (unknownField) {
    next(badRequestError(`Unknown field: ${unknownField}.`));
    return null;
  }

  return body;
};

export const validateCreateProfile = (req, res, next) => {
  const body = validateBodyStructure(req, res, next);

  if (!body) {
    return;
  }

  if (validateRequiredFieldPresence(body, next)) {
    return;
  }

  if (validateOptionalFields(body, next)) {
    return;
  }

  next();
};

export const validateUpdateProfile = (req, res, next) => {
  const body = validateBodyStructure(req, res, next);

  if (!body) {
    return;
  }

  const acceptedFieldsPresent = Object.keys(body).filter((field) =>
    ALLOWED_FIELDS.includes(field),
  );

  if (acceptedFieldsPresent.length === 0) {
    next(validationError("At least one field must be provided."));
    return;
  }

  if (validatePresentFieldValues(body, next)) {
    return;
  }

  if (validateOptionalFields(body, next)) {
    return;
  }

  next();
};
