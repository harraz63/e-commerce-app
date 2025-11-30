import { Router } from "express";
import {
  authentication,
  authorizationMiddleware,
  Multer,
} from "../../Middlewares";
import { RoleEnum } from "../../Common";
import adminService from "./Services/admin.service";

const adminController = Router();

// Create Category
adminController.post(
  "/create-category",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  adminService.createCategory
);

// Delete Category
adminController.delete(
  "/delete-category/:categoryId",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  adminService.deleteCategory
);

// List All Products
adminController.get(
  "/list-all-products",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  adminService.listAllProducts
);

// Add Product
adminController.post(
  "/add-product",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  Multer().array("productPictures"),
  adminService.addProduct
);

// Update Product
adminController.put(
  "/update-product/:productId",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  Multer().array("productPictures"),
  adminService.updateProduct
);

// Delete Product
adminController.delete(
  "/delete-product/:productId",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  adminService.deleteProduct
);

// Add Coupon
adminController.post(
  "/add-coupon",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  adminService.addCoupon
);

// Delete Coupon
adminController.delete(
  "/delete-coupon/:couponId",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  adminService.deleteCoupon
);

export { adminController };
