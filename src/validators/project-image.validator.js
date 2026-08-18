import { isValidUuid } from "../utils/uuid.js";
import {
  isMeaningfulString,
  isValidUrl,
  badRequestError,
  validationError,
} from "../utils/validation.js";

const ALLOWED_CREATE_FIELDS = ["projectId", "url", "altText", "sortOrder"];

const ALLOWED_UPDATE_FIELDS = ["url", "altText", "sortOrder"];

const REQUIRED_CREATE_FIELDS = ["projectId", "url"];

const REQUIRED_FIELD_LABELS = {
  projectId: "Project ID",
  url: "URL",
};

const validateBodyStructure = (allowedFields, req, res, next) => {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return next(badRequestError("Request body must be an object."));
  }

  const unknownField = Object.keys(body).find(
    (field) => !allowedFields.includes(field),
  );

  if (unknownField) {
    return next(badRequestError(`Unknown field: ${unknownField}.`));
  }

  next();
};

const validateRequiredFields = (body, next) => {
  for (const field of REQUIRED_CREATE_FIELDS) {
    if (body[field] === undefined || body[field] === null) {
      return next(
        validationError(`${REQUIRED_FIELD_LABELS[field]} is required.`),
      );
    }
  }

  return null;
};

const validateFieldValues = (body, next) => {
  if (body.projectId !== undefined) {
    if (!isMeaningfulString(body.projectId)) {
      return next(validationError("Project ID must be a non-empty string."));
    }
    if (!isValidUuid(body.projectId)) {
      return next(validationError("Project ID must be a valid UUID."));
    }
  }

  if (body.url !== undefined) {
    if (!isMeaningfulString(body.url)) {
      return next(validationError("URL must be a non-empty string."));
    }
    if (!isValidUrl(body.url)) {
      return next(validationError("URL must be a valid URL."));
    }
  }

  if (body.altText !== undefined && body.altText !== null) {
    if (typeof body.altText !== "string") {
      return next(validationError("Alt text must be a string."));
    }
  }

  if (body.sortOrder !== undefined) {
    if (body.sortOrder === null) {
      return next(validationError("Sort order must be an integer."));
    }
    if (
      typeof body.sortOrder !== "number" ||
      !Number.isInteger(body.sortOrder)
    ) {
      return next(validationError("Sort order must be an integer."));
    }
  }

  return null;
};

export const validateCreateProjectImage = (req, res, next) => {
  validateBodyStructure(ALLOWED_CREATE_FIELDS, req, res, (err) => {
    if (err) return next(err);

    if (validateRequiredFields(req.body, next)) return;

    if (validateFieldValues(req.body, next)) return;

    next();
  });
};

export const validateUpdateProjectImage = (req, res, next) => {
  validateBodyStructure(ALLOWED_UPDATE_FIELDS, req, res, (err) => {
    if (err) return next(err);

    const acceptedFieldsPresent = Object.keys(req.body).filter((field) =>
      ALLOWED_UPDATE_FIELDS.includes(field),
    );

    if (acceptedFieldsPresent.length === 0) {
      return next(validationError("At least one field must be provided."));
    }

    if (validateFieldValues(req.body, next)) return;

    next();
  });
};

export const validateProjectImageId = (req, res, next) => {
  if (!isValidUuid(req.params.id)) {
    return next(badRequestError("Project image id must be a valid UUID."));
  }

  next();
};
