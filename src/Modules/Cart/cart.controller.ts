import { Router } from "express";
import cartService from "./Services/cart.service";
import { authentication } from "../../Middlewares";

const cartController = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: User Cart Management
 */

/**
 * @swagger
 * /cart/add/{productId}:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
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
 *         description: Product added to cart successfully
 *       401:
 *         description: Unauthorized
 */
cartController.post(
  "/add/:productId",
  authentication,
  cartService.addProductToCart
);

/**
 * @swagger
 * /cart/{productId}/increment:
 *   put:
 *     summary: Increment quantity of a cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cart item to increment
 *     responses:
 *       200:
 *         description: Cart item incremented successfully
 *       401:
 *         description: Unauthorized
 */
cartController.put(
  "/:productId/increment",
  authentication,
  cartService.incrementCartItem
);

/**
 * @swagger
 * /cart/{productId}/decrement:
 *   put:
 *     summary: Decrement quantity of a cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cart item to decrement
 *     responses:
 *       200:
 *         description: Cart item decremented successfully
 *       401:
 *         description: Unauthorized
 */
cartController.put(
  "/:productId/decrement",
  authentication,
  cartService.decrementCartItem
);

/**
 * @swagger
 * /cart/{productId}/delete:
 *   delete:
 *     summary: Delete a cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cart item to delete
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 *       401:
 *         description: Unauthorized
 */
cartController.delete(
  "/:productId/delete",
  authentication,
  cartService.deleteCartItem
);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart retrieved successfully
 *       401:
 *         description: Unauthorized
 */
cartController.get("/", authentication, cartService.getCart);

export { cartController };
