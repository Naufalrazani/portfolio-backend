import "dotenv/config";
import bcrypt from "bcryptjs";

import { findByUsername, create } from "../src/repositories/admin-user.repository.js";
import prisma from "../src/lib/prisma.js";

const BCRYPT_COST = 10;

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!username || typeof username !== "string" || username.trim().length === 0) {
    console.error("SEED_ADMIN_USERNAME is not set or empty.");
    process.exit(1);
  }

  if (!password || typeof password !== "string" || password.length === 0) {
    console.error("SEED_ADMIN_PASSWORD is not set or empty.");
    process.exit(1);
  }

  const existing = await findByUsername(username);

  if (existing) {
    console.log("Admin user already exists. Skipping creation.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  await create({
    username,
    passwordHash,
  });

  console.log("Admin user created successfully.");
}

main()
  .catch((err) => {
    console.error("Failed to seed admin user:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
