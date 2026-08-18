import { isValidUuid } from "../utils/uuid.js";
import {
  isMeaningfulString,
  isValidUrl,
  isValidDate,
  badRequestError,
  validationError,
} from "../utils/validation.js";

const ALLOWED_FIELDS = [
  "name",
  "issuer",
  "issueDate",
  "credentialUrl",
  "imageUrl",
  "description",
  "sortOrder",
];

const REQUIRED_FIELDS = ["name", "issuer"];

const REQUIRED_FIELD_LABELS = {
  name: "Name",
  issuer: "Issuer",
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
  if (body.name !== undefined && !isMeaningfulString(body.name)) {
    return next(validationError("Name must be a non-empty string."));
  }

  if (body.issuer !== undefined && !isMeaningfulString(body.issuer)) {
    return next(validationError("Issuer must be a non-empty string."));
  }

  if (body.issueDate !== undefined && body.issueDate !== null) {
    if (typeof body.issueDate !== "string" || !isValidDate(body.issueDate)) {
      return next(validationError("Issue date must be a valid date (YYYY-MM-DD)."));
    }
  }

  if (body.credentialUrl !== undefined && body.credentialUrl !== null) {
    if (typeof body.credentialUrl !== "string") {
      return next(validationError("Credential URL must be a string."));
    }
    if (!isValidUrl(body.credentialUrl)) {
      return next(validationError("Credential URL must be a valid URL."));
    }
  }

  if (body.imageUrl !== undefined && body.imageUrl !== null) {
    if (typeof body.imageUrl !== "string") {
      return next(validationError("Image URL must be a string."));
    }
    if (!isValidUrl(body.imageUrl)) {
      return next(validationError("Image URL must be a valid URL."));
    }
  }

  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== "string") {
      return next(validationError("Description must be a string."));
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

export const validateCreateCertificate = (req, res, next) => {
  validateBodyStructure(req, res, (err) => {
    if (err) return next(err);

    if (validateRequiredFields(req.body, next)) return;

    if (validateFieldValues(req.body, next)) return;

    next();
  });
};

export const validateUpdateCertificate = (req, res, next) => {
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

export const validateCertificateId = (req, res, next) => {
  if (!isValidUuid(req.params.id)) {
    return next(badRequestError("Certificate id must be a valid UUID."));
  }

  next();
};
