import { Router } from "express";
import { authentication } from "../../Middlewares";
import profileService from "./Services/profile.service";

const profileController = Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User Profile & Addresses Management
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get profile data of logged-in user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
profileController.get("/", authentication, profileService.getProfile);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update profile data
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
profileController.put("/", authentication, profileService.updateProfile);

/**
 * @swagger
 * /profile/addresses:
 *   get:
 *     summary: Get all saved addresses of the user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses retrieved successfully
 *       401:
 *         description: Unauthorized
 */
profileController.get("/addresses", authentication, profileService.getAllAddresses);

/**
 * @swagger
 * /profile/addresses:
 *   post:
 *     summary: Add a new address
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - city
 *               - country
 *               - zipCode
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               zipCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Address added successfully
 *       401:
 *         description: Unauthorized
 */
profileController.post("/addresses", authentication, profileService.addNewAddress);

/**
 * @swagger
 * /profile/addresses/{id}:
 *   put:
 *     summary: Update a specific address
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the address to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               zipCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
profileController.put("/addresses/:id", authentication, profileService.updateAddress);

/**
 * @swagger
 * /profile/addresses/{id}:
 *   delete:
 *     summary: Delete a specific address
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the address to delete
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
profileController.delete("/addresses/:id", authentication, profileService.deleteAddress);

/**
 * @swagger
 * /profile/change-password:
 *   put:
 *     summary: Change password of logged-in user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Incorrect old password
 *       401:
 *         description: Unauthorized
 */
profileController.put("/change-password", authentication, profileService.changePassword);

export { profileController };
