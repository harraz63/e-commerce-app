import { Router } from "express";
import authService from "./Services/auth.service";
import {
  authentication,
  loginLimiter,
  otpLimiter,
  validationMiddleware,
} from "../../Middlewares";
import { SignUpSchemaValidator } from "../../Validators";

const authController = Router();

// Register
authController.post(
  "/register",
  validationMiddleware({ body: SignUpSchemaValidator }),
  authService.register
);

// Register By Gmail
authController.post("/register-gmail", authService.registerByGmail);

// Login
authController.post("/login", loginLimiter, authService.login);

// LogOut
authController.post("/logout", authentication, authService.logout);

// Forget Password
authController.post("/forgot-password", otpLimiter, authService.forgotPassword);

// Reset Password
authController.post("/reset-password", authService.resetPassword);

// Refresh Token
authController.post("/refresh-token", authService.refreshToken);

export { authController };
