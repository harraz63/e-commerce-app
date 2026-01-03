import { Router } from "express";
import {
  authentication,
  authorizationMiddleware,
  Multer,
} from "../../Middlewares";
import { RoleEnum } from "../../Common";
import adminService from "./Services/admin.service";

const adminController = Router();

/**
 * @swagger
 * /admin/create-category:
 *   post:
 *     summary: Create new category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
// Create Category
adminController.post(
  "/create-category",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  adminService.createCategory
);

/**
 * @swagger
 * /admin/delete-category/{categoryId}:
 *   delete:
 *     summary: Delete category
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
// Delete Category
adminController.delete(
  "/delete-category/:categoryId",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  adminService.deleteCategory
);

/**
 * @swagger
 * /admin/list-all-products:
 *   get:
 *     summary: List all products
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products fetched successfully
 */
// List All Products
adminController.get(
  "/list-all-products",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  adminService.listAllProducts
);

/**
 * @swagger
 * /admin/add-product:
 *   post:
 *     summary: Add new product
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15
 *               price:
 *                 type: number
 *                 example: 35000
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               productPictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product added successfully
 */
// Add Product
adminController.post(
  "/add-product",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  Multer().array("productPictures"),
  adminService.addProduct
);

/**
 * @swagger
 * /admin/update-product/{productId}:
 *   put:
 *     summary: Update product
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               productPictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
// Update Product
adminController.put(
  "/update-product/:productId",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  Multer().array("productPictures"),
  adminService.updateProduct
);

/**
 * @swagger
 * /admin/delete-product/{productId}:
 *   delete:
 *     summary: Delete product
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
// Delete Product
adminController.delete(
  "/delete-product/:productId",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  adminService.deleteProduct
);

/**
 * @swagger
 * /admin/add-coupon:
 *   post:
 *     summary: Add coupon
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discount
 *               - expiryDate
 *             properties:
 *               code:
 *                 type: string
 *                 example: SAVE10
 *               discount:
 *                 type: number
 *                 example: 10
 *               expiryDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Coupon added successfully
 */
// Add Coupon
adminController.post(
  "/add-coupon",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  adminService.addCoupon
);

/**
 * @swagger
 * /admin/delete-coupon/{couponId}:
 *   delete:
 *     summary: Delete coupon
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: couponId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 */
// Delete Coupon
adminController.delete(
  "/delete-coupon/:couponId",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  adminService.deleteCoupon
);

export { adminController };
