import "dotenv/config";

const nodeEnv = process.env.NODE_ENV || "development";
const allowedNodeEnvs = ["development", "production", "test"];

if (!allowedNodeEnvs.includes(nodeEnv)) {
  console.error(`Invalid NODE_ENV "${nodeEnv}". Must be one of: ${allowedNodeEnvs.join(", ")}`);
  process.exit(1);
}

const port = Number(process.env.PORT) || 3000;

const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

if (!jwtSecret) {
  console.error("JWT_SECRET is not set.");
  process.exit(1);
}

if (jwtSecret.length < 32) {
  console.error("JWT_SECRET must be at least 32 characters long.");
  process.exit(1);
}

let corsOrigin = undefined;

if (nodeEnv === "production") {
  const raw = process.env.CORS_ORIGIN;

  if (!raw) {
    console.error("CORS_ORIGIN is not set in production.");
    process.exit(1);
  }

  corsOrigin = raw.split(",").map((o) => o.trim());
}

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME || undefined;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY || undefined;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET || undefined;

export const env = {
  nodeEnv,
  port,
  jwtSecret,
  databaseUrl,
  corsOrigin,
  cloudinaryCloudName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
};
