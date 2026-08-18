import { isValidUuid } from "../utils/uuid.js";
import {
  isMeaningfulString,
  isValidUrl,
  isValidDate,
  badRequestError,
  validationError,
} from "../utils/validation.js";

const ALLOWED_FIELDS = [
  "title",
  "description",
  "organization",
  "date",
  "url",
  "sortOrder",
];

const REQUIRED_FIELDS = ["title"];

const REQUIRED_FIELD_LABELS = {
  title: "Title",
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
  if (body.title !== undefined && !isMeaningfulString(body.title)) {
    return next(validationError("Title must be a non-empty string."));
  }

  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== "string") {
      return next(validationError("Description must be a string."));
    }
  }

  if (body.organization !== undefined && body.organization !== null) {
    if (typeof body.organization !== "string") {
      return next(validationError("Organization must be a string."));
    }
  }

  if (body.date !== undefined && body.date !== null) {
    if (typeof body.date !== "string" || !isValidDate(body.date)) {
      return next(validationError("Date must be a valid date (YYYY-MM-DD)."));
    }
  }

  if (body.url !== undefined && body.url !== null) {
    if (typeof body.url !== "string") {
      return next(validationError("URL must be a string."));
    }
    if (!isValidUrl(body.url)) {
      return next(validationError("URL must be a valid URL."));
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

export const validateCreateAchievement = (req, res, next) => {
  validateBodyStructure(req, res, (err) => {
    if (err) return next(err);

    if (validateRequiredFields(req.body, next)) return;

    if (validateFieldValues(req.body, next)) return;

    next();
  });
};

export const validateUpdateAchievement = (req, res, next) => {
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

export const validateAchievementId = (req, res, next) => {
  if (!isValidUuid(req.params.id)) {
    return next(badRequestError("Achievement id must be a valid UUID."));
  }

  next();
};
