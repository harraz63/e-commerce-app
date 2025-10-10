import { Router } from "express";
import { authentication } from "../../Middlewares";
import profileService from "./Services/profile.service";

const profileController = Router();

// Get Profile Data
profileController.get("/", authentication, profileService.getProfile);

// Update Profile Data
profileController.put("/", authentication, profileService.updateProfile);

// Get All Saved Addresses
profileController.get(
  "/addresses",
  authentication,
  profileService.getAllAddresses
);

// Add New Address
profileController.post(
  "/addresses",
  authentication,
  profileService.addNewAddress
);

// Update Specific Address
profileController.put(
  "/addresses/:id",
  authentication,
  profileService.updateAddress
);

// Delete Specific Address
profileController.delete(
  "/addresses/:id",
  authentication,
  profileService.deleteAddress
);

// Change Password
profileController.put(
  "/change-password",
  authentication,
  profileService.changePassword
);

export { profileController };
