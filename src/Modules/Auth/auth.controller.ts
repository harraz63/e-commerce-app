import { Router } from "express";
import authService from "./Services/auth.service";
import { authentication } from "../../Middlewares";

const authController = Router();

// Register
authController.post("/register", authService.register);

// Register By Gmail
authController.post("/register-gmail", authService.registerByGmail);

// Login
authController.post("/login", authService.login);

// LogOut
authController.post("/logout", authentication, authService.logout);

// Forget Password
authController.post("/forgot-password", authService.forgotPassword);

// Reset Password
authController.post("/reset-password", authService.resetPassword);

// Refresh Token
authController.post("/refresh-token", authService.refreshToken);

export { authController };
