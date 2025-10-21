import { Router } from "express";
import cartService from "./Services/cart.service";
import { authentication } from "../../Middlewares";

const cartController = Router();

// Add Product To Cart
cartController.post(
  "/add/:productId",
  authentication,
  cartService.addProductToCart
);

// Increment Cart Item
cartController.put(
  "/:productId/increment",
  authentication,
  cartService.incrementCartItem
);

// Decrement Cart Item
cartController.put(
  "/:productId/decrement",
  authentication,
  cartService.decrementCartItem
);

// Delete Cart Item
cartController.delete(
  "/:productId/delete",
  authentication,
  cartService.deleteCartItem
);

// Get User Cart
cartController.get("/", authentication, cartService.getCart);

export { cartController };
