export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (
    err &&
    typeof err === "object" &&
    !(err instanceof Error) &&
    typeof err.status === "number" &&
    typeof err.code === "string" &&
    typeof err.message === "string"
  ) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: {
        code: "BAD_REQUEST",
        message: "Invalid request body.",
      },
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(400).json({
      error: {
        code: "BAD_REQUEST",
        message: "Request body too large.",
      },
    });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(422).json({
      error: {
        code: "FILE_TOO_LARGE",
        message: "File must be 5MB or smaller.",
      },
    });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      error: {
        code: "INVALID_MULTIPART",
        message: "Unexpected field in multipart data.",
      },
    });
  }

  if (err.code === "LIMIT_NO_FILE") {
    return res.status(400).json({
      error: {
        code: "MISSING_FILE",
        message: "No file provided.",
      },
    });
  }

  console.error(err);

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error.",
    },
  });
}
