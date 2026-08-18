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

  console.error(err);

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error.",
    },
  });
}
