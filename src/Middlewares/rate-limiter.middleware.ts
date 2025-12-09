import rateLimit from "express-rate-limit";

// Global limiter – protects entire app
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: "Too many requests, please try again later.",
});

// Login brute-force protection
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: "Too many login attempts. Try again in 1 minute.",
});

// OTP limiter
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: "Too many OTP requests. Please wait a moment.",
});

// Search spam protection
export const searchLimiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 10,
  message: "Too many search requests.",
});

// Order spam prevention
export const orderLimiter = rateLimit({
  windowMs: 3 * 1000, // 3 seconds
  max: 1,
  message: "Too many orders. Slow down.",
});

// Add To Cart limiter
export const cartLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: "Too many cart actions. Please wait.",
});
