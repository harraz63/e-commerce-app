import { Router } from "express";
import { authentication } from "../../Middlewares";
import orderService from "./Services/order.service";

const ordersController = Router();

// Create Order
ordersController.post("/create", authentication, orderService.createOrder);

// Get User Orders
ordersController.get(
  "/get-all-orders",
  authentication,
  orderService.getAllOrders
);

// Get Specific Order Details
ordersController.get(
  "/get-order/:orderId",
  authentication,
  orderService.getOrderDetails
);

// Cancel Order
ordersController.post(
  "/cancel-order/:orderId",
  authentication,
  orderService.cancelOrder
);

export { ordersController };
