import { Router } from "express";
import { authentication } from "../../Middlewares";
import wishlistService from "./Services/wishlist.service";

const wishlistController = Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: User Wishlist Management
 */

/**
 * @swagger
 * /wishlist/add/{productId}:
 *   post:
 *     summary: Add a product to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to add
 *     responses:
 *       200:
 *         description: Product added to wishlist successfully
 *       401:
 *         description: Unauthorized
 */
wishlistController.post(
  "/add/:productId",
  authentication,
  wishlistService.addToWishlist
);

/**
 * @swagger
 * /wishlist/list:
 *   get:
 *     summary: Get wishlist data of logged-in user
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *       401:
 *         description: Unauthorized
 */
wishlistController.get("/list", authentication, wishlistService.getWishlist);

/**
 * @swagger
 * /wishlist/delete-product:
 *   delete:
 *     summary: Delete a product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully
 *       401:
 *         description: Unauthorized
 */
wishlistController.delete(
  "/delete-product",
  authentication,
  wishlistService.deleteProductFromWishlist
);

export { wishlistController };
