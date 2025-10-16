import { Router } from "express";
import cartService from "./Services/cart.service";
import { authentication } from "../../Middlewares";

const cartController = Router();

// Add Product To Cart
cartController.post("/add/:productId", authentication, cartService.addProductToCart)

export { cartController };
