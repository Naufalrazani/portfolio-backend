import rateLimit from "express-rate-limit";

const RATE_LIMIT_RESPONSE = {
  error: {
    code: "RATE_LIMITED",
    message: "Too many requests. Please try again later.",
  },
};

const LOGIN_RATE_LIMIT_RESPONSE = {
  error: {
    code: "RATE_LIMITED",
    message: "Too many login attempts. Please try again later.",
  },
};

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    res.status(429).json(LOGIN_RATE_LIMIT_RESPONSE);
  },
});

export const contactMessageRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json(RATE_LIMIT_RESPONSE);
  },
});
