import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { findByUsername } from "../repositories/admin-user.repository.js";

const TOKEN_EXPIRES_IN_SECONDS = 3600;

const invalidCredentialsError = () => {
  return {
    status: 401,
    code: "UNAUTHORIZED",
    message: "Invalid credentials.",
  };
};

export const login = async (input) => {
  const adminUser = await findByUsername(input.username);

  const passwordMatches =
    adminUser !== null &&
    (await bcrypt.compare(input.password, adminUser.passwordHash));

  if (!passwordMatches) {
    throw invalidCredentialsError();
  }

  const token = jwt.sign(
    {
      sub: adminUser.id,
    },
    env.jwtSecret,
    {
      algorithm: "HS256",
      expiresIn: TOKEN_EXPIRES_IN_SECONDS,
    },
  );

  return { token };
};
