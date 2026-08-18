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
  "slug",
  "shortDescription",
  "description",
  "technologies",
  "repositoryUrl",
  "demoUrl",
  "category",
  "status",
  "published",
  "featured",
  "startDate",
  "endDate",
  "sortOrder",
];

const REQUIRED_FIELDS = [
  "title",
  "slug",
  "description",
  "technologies",
  "status",
  "published",
  "featured",
];

const REQUIRED_FIELD_LABELS = {
  title: "Title",
  slug: "Slug",
  description: "Description",
  technologies: "Technologies",
  status: "Status",
  published: "Published",
  featured: "Featured",
};

const VALID_STATUSES = ["IN_PROGRESS", "COMPLETED", "ARCHIVED"];

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
    if (body[field] === undefined) {
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

  if (body.slug !== undefined && !isMeaningfulString(body.slug)) {
    return next(validationError("Slug must be a non-empty string."));
  }

  if (
    body.shortDescription !== undefined &&
    body.shortDescription !== null &&
    typeof body.shortDescription !== "string"
  ) {
    return next(validationError("Short description must be a string."));
  }

  if (body.description !== undefined && !isMeaningfulString(body.description)) {
    return next(validationError("Description must be a non-empty string."));
  }

  if (body.technologies !== undefined) {
    if (!Array.isArray(body.technologies)) {
      return next(validationError("Technologies must be an array."));
    }
    for (const tech of body.technologies) {
      if (!isMeaningfulString(tech)) {
        return next(
          validationError("Each technology must be a non-empty string."),
        );
      }
    }
  }

  if (body.repositoryUrl !== undefined && body.repositoryUrl !== null) {
    if (!isMeaningfulString(body.repositoryUrl)) {
      return next(
        validationError("Repository URL must be a non-empty string."),
      );
    }
    if (!isValidUrl(body.repositoryUrl)) {
      return next(validationError("Repository URL must be a valid URL."));
    }
  }

  if (body.demoUrl !== undefined && body.demoUrl !== null) {
    if (!isMeaningfulString(body.demoUrl)) {
      return next(validationError("Demo URL must be a non-empty string."));
    }
    if (!isValidUrl(body.demoUrl)) {
      return next(validationError("Demo URL must be a valid URL."));
    }
  }

  if (
    body.category !== undefined &&
    body.category !== null &&
    typeof body.category !== "string"
  ) {
    return next(validationError("Category must be a string."));
  }

  if (body.status !== undefined) {
    if (!isMeaningfulString(body.status)) {
      return next(validationError("Status must be a non-empty string."));
    }
    if (!VALID_STATUSES.includes(body.status)) {
      return next(
        validationError(
          `Status must be one of: ${VALID_STATUSES.join(", ")}.`,
        ),
      );
    }
  }

  if (body.published !== undefined) {
    if (typeof body.published !== "boolean") {
      return next(validationError("Published must be a boolean."));
    }
  }

  if (body.featured !== undefined) {
    if (typeof body.featured !== "boolean") {
      return next(validationError("Featured must be a boolean."));
    }
  }

  if (body.startDate !== undefined && body.startDate !== null) {
    if (!isValidDate(body.startDate)) {
      return next(
        validationError(
          "Start date must be a valid date in YYYY-MM-DD format.",
        ),
      );
    }
  }

  if (body.endDate !== undefined && body.endDate !== null) {
    if (!isValidDate(body.endDate)) {
      return next(
        validationError(
          "End date must be a valid date in YYYY-MM-DD format.",
        ),
      );
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

export const validateCreateProject = (req, res, next) => {
  validateBodyStructure(req, res, (err) => {
    if (err) return next(err);

    if (validateRequiredFields(req.body, next)) return;

    if (validateFieldValues(req.body, next)) return;

    next();
  });
};

export const validateUpdateProject = (req, res, next) => {
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

export const validateProjectId = (req, res, next) => {
  if (!isValidUuid(req.params.id)) {
    return next(badRequestError("Project id must be a valid UUID."));
  }

  next();
};
