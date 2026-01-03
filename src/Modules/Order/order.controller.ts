import { Router } from "express";
import { authentication } from "../../Middlewares";
import orderService from "./Services/order.service";

const ordersController = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: User Orders Management
 */

/**
 * @swagger
 * /orders/create:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - totalPrice
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Unauthorized
 */
ordersController.post("/create", authentication, orderService.createOrder);

/**
 * @swagger
 * /orders/get-all-orders:
 *   get:
 *     summary: Get all orders of the logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *       401:
 *         description: Unauthorized
 */
ordersController.get(
  "/get-all-orders",
  authentication,
  orderService.getAllOrders
);

/**
 * @swagger
 * /orders/get-order/{orderId}:
 *   get:
 *     summary: Get details of a specific order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
ordersController.get(
  "/get-order/:orderId",
  authentication,
  orderService.getOrderDetails
);

/**
 * @swagger
 * /orders/pay:
 *   post:
 *     summary: Pay for an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - paymentMethod
 *             properties:
 *               orderId:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 example: stripe
 *     responses:
 *       200:
 *         description: Order paid successfully
 *       401:
 *         description: Unauthorized
 */
ordersController.post("/pay", authentication, orderService.payOrder);

/**
 * @swagger
 * /orders/stripe-webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received
 */
ordersController.post("/stripe-webhook", orderService.stripeWebhook);

/**
 * @swagger
 * /orders/cancel-order/{orderId}:
 *   post:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to cancel
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
ordersController.post(
  "/cancel-order/:orderId",
  authentication,
  orderService.cancelOrder
);

export { ordersController };
