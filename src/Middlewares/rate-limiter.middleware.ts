import rateLimit from "express-rate-limit";
import { Request } from "express";
// @ts-ignore
import MongoStore from "rate-limit-mongo";

// Rate Limiter Middleware With Mongo Store
const createLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message,
    keyGenerator: (req: Request) => {
      // Combine IP with endpoint path
      // req.ip is already normalized by express-rate-limit's internal processing
      return `${req.ip}-${req.path}`;
    },
    store: new MongoStore({
      uri: process.env.DB_URL_LOCAL as string,
      collectionName: "rateLimit",
      expireTimeMs: windowMs,
    }),
    standardHeaders: true,
    legacyHeaders: false,
    // This tells express-rate-limit to validate IPv6 handling
    validate: { xForwardedForHeader: false },
  });
};

// Global limiter – protects entire app
export const globalLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  300,
  "Too many requests, please try again later."
);

// Login brute-force protection
export const loginLimiter = createLimiter(
  60 * 1000, // 1 minute
  5,
  "Too many login attempts. Try again in 1 minute."
);

// OTP limiter
export const otpLimiter = createLimiter(
  5 * 60 * 1000,
  3,
  "Too many OTP requests. Please wait a moment."
);

// Search spam protection
export const searchLimiter = createLimiter(
  5 * 1000, // 5 seconds
  10,
  "Too many search requests."
);

// Order spam prevention
export const orderLimiter = createLimiter(
  3 * 1000, // 3 seconds
  1,
  "Too many orders. Slow down."
);

// Add To Cart limiter
export const cartLimiter = createLimiter(
  60 * 1000,
  20,
  "Too many cart actions. Please wait."
);