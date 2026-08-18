const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const isMeaningfulString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

export const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const isValidDate = (value) => {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }
  const date = new Date(value);
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export const badRequestError = (message) => {
  return {
    status: 400,
    code: "BAD_REQUEST",
    message,
  };
};

export const validationError = (message) => {
  return {
    status: 422,
    code: "VALIDATION_ERROR",
    message,
  };
};
