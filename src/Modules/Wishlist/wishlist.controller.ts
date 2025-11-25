import { Router } from "express";
import { authentication } from "../../Middlewares";
import wishlistService from "./Services/wishlist.service";

const wishlistController = Router();

// Add Product To Wishlist
wishlistController.post(
  "/add/:productId",
  authentication,
  wishlistService.addToWishlist
);

// Get Wishlist Data
wishlistController.get("/list", authentication, wishlistService.getWishlist);

export { wishlistController };
