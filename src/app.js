import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env.js";

import achievementRoutes from "./routes/achievement.routes.js";
import authRoutes from "./routes/auth.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import contactMessageRoutes from "./routes/contact-message.routes.js";
import educationRoutes from "./routes/education.routes.js";
import experienceRoutes from "./routes/experience.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import profileRoutes from "./routes/profile.routes.js";
import projectImageRoutes from "./routes/project-image.routes.js";
import projectRoutes from "./routes/project.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import socialLinkRoutes from "./routes/social-link.routes.js";

const app = express();

if (env.nodeEnv === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());

const corsOptions =
  env.nodeEnv === "production"
    ? {
        origin: env.corsOrigin,
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }
    : {};

app.use(cors(corsOptions));

app.use(express.json({ limit: "100kb" }));

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1", profileRoutes);
app.use("/api/v1", socialLinkRoutes);
app.use("/api/v1", skillRoutes);
app.use("/api/v1", experienceRoutes);
app.use("/api/v1", educationRoutes);
app.use("/api/v1", projectRoutes);
app.use("/api/v1", projectImageRoutes);
app.use("/api/v1", certificateRoutes);
app.use("/api/v1", achievementRoutes);
app.use("/api/v1", contactMessageRoutes);
app.use("/api/v1", authRoutes);

app.use("/api/v1", (req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Endpoint not found.",
    },
  });
});

app.use(errorHandler);

export default app;
