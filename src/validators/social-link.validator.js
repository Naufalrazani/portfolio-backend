import { isValidUuid } from "../utils/uuid.js";
import {
  isMeaningfulString,
  isValidUrl,
  badRequestError,
  validationError,
} from "../utils/validation.js";

const ALLOWED_FIELDS = ["platform", "url", "label", "sortOrder"];

const REQUIRED_FIELDS = ["platform", "url"];

const REQUIRED_FIELD_LABELS = {
  platform: "Platform",
  url: "URL",
};

const validateBodyStructure = (req, res, next) => {
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

  next();
};

const validateRequiredFields = (body, next) => {
  for (const field of REQUIRED_FIELDS) {
    if (!isMeaningfulString(body[field])) {
      return next(
        validationError(`${REQUIRED_FIELD_LABELS[field]} is required.`),
      );
    }
  }

  return null;
};

const validateFieldValues = (body, next) => {
  if (body.platform !== undefined && !isMeaningfulString(body.platform)) {
    return next(
      validationError("Platform must be a non-empty string."),
    );
  }

  if (body.url !== undefined) {
    if (!isMeaningfulString(body.url)) {
      return next(validationError("URL must be a non-empty string."));
    }
    if (!isValidUrl(body.url)) {
      return next(validationError("URL must be a valid URL."));
    }
  }

  if (body.label !== undefined && body.label !== null) {
    if (typeof body.label !== "string") {
      return next(validationError("Label must be a string."));
    }
  }

  if (body.sortOrder !== undefined) {
    if (body.sortOrder === null) {
      return next(validationError("Sort order must be an integer."));
    }
    if (typeof body.sortOrder !== "number" || !Number.isInteger(body.sortOrder)) {
      return next(validationError("Sort order must be an integer."));
    }
  }

  return null;
};

export const validateCreateSocialLink = (req, res, next) => {
  validateBodyStructure(req, res, (err) => {
    if (err) return next(err);

    if (validateRequiredFields(req.body, next)) return;

    if (validateFieldValues(req.body, next)) return;

    next();
  });
};

export const validateUpdateSocialLink = (req, res, next) => {
  validateBodyStructure(req, res, (err) => {
    if (err) return next(err);

    const acceptedFieldsPresent = Object.keys(req.body).filter((field) =>
      ALLOWED_FIELDS.includes(field),
    );

    if (acceptedFieldsPresent.length === 0) {
      return next(validationError("At least one field must be provided."));
    }

    if (validateFieldValues(req.body, next)) return;

    next();
  });
};

export const validateSocialLinkId = (req, res, next) => {
  if (!isValidUuid(req.params.id)) {
    return next(badRequestError("Social link id must be a valid UUID."));
  }

  next();
};
