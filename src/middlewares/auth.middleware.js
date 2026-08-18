import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

const authenticationError = () => {
  return {
    status: 401,
    code: "UNAUTHORIZED",
    message: "Invalid or missing authentication token.",
  };
};

export const authenticate = (req, res, next) => {
  const authorization = req.get("authorization") ?? "";
  const [scheme, token] = authorization.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return next(authenticationError());
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret, {
      algorithms: ["HS256"],
    });
  } catch {
    return next(authenticationError());
  }

  if (typeof payload.sub !== "string" || payload.sub.length === 0) {
    return next(authenticationError());
  }

  req.auth = {
    adminId: payload.sub,
  };

  next();
};

export const optionalAuthenticate = (req, res, next) => {
  const authorization = req.get("authorization") ?? "";
  const [scheme, token] = authorization.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return next();
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret, {
      algorithms: ["HS256"],
    });
  } catch {
    return next(authenticationError());
  }

  if (typeof payload.sub !== "string" || payload.sub.length === 0) {
    return next(authenticationError());
  }

  req.auth = {
    adminId: payload.sub,
  };

  next();
};
