import { isValidUuid } from "../utils/uuid.js";
import {
  isMeaningfulString,
  isValidDate,
  badRequestError,
  validationError,
} from "../utils/validation.js";

const ALLOWED_FIELDS = [
  "role",
  "organization",
  "description",
  "location",
  "startDate",
  "endDate",
  "sortOrder",
];

const REQUIRED_FIELDS = ["role", "organization", "startDate"];

const REQUIRED_FIELD_LABELS = {
  role: "Role",
  organization: "Organization",
  startDate: "Start date",
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
  if (body.role !== undefined && !isMeaningfulString(body.role)) {
    return next(validationError("Role must be a non-empty string."));
  }

  if (body.organization !== undefined && !isMeaningfulString(body.organization)) {
    return next(validationError("Organization must be a non-empty string."));
  }

  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== "string") {
      return next(validationError("Description must be a string."));
    }
  }

  if (body.location !== undefined && body.location !== null) {
    if (typeof body.location !== "string") {
      return next(validationError("Location must be a string."));
    }
  }

  if (body.startDate !== undefined) {
    if (typeof body.startDate !== "string" || !isValidDate(body.startDate)) {
      return next(validationError("Start date must be a valid date (YYYY-MM-DD)."));
    }
  }

  if (body.endDate !== undefined && body.endDate !== null) {
    if (typeof body.endDate !== "string" || !isValidDate(body.endDate)) {
      return next(validationError("End date must be a valid date (YYYY-MM-DD)."));
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

export const validateCreateExperience = (req, res, next) => {
  validateBodyStructure(req, res, (err) => {
    if (err) return next(err);

    if (validateRequiredFields(req.body, next)) return;

    if (validateFieldValues(req.body, next)) return;

    next();
  });
};

export const validateUpdateExperience = (req, res, next) => {
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

export const validateExperienceId = (req, res, next) => {
  if (!isValidUuid(req.params.id)) {
    return next(badRequestError("Experience id must be a valid UUID."));
  }

  next();
};
