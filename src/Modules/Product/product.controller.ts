import { Router } from "express";
import productService from "./Services/product.service";
import { authentication } from "../../Middlewares";

const productController = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product Management APIs
 */

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products by name (public)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Product name to search
 *     responses:
 *       200:
 *         description: List of products matching the search
 */
productController.get("/search", productService.searchByProductName);

/**
 * @swagger
 * /products/related-products/{productId}:
 *   get:
 *     summary: Get related products by product ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to find related products
 *     responses:
 *       200:
 *         description: List of related products
 *       404:
 *         description: Product not found
 */
productController.get(
  "/related-products/:productId",
  productService.getRelatedProducts
);

/**
 * @swagger
 * /products/category/{categoryId}:
 *   get:
 *     summary: Get products by category (public)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: List of products in the category
 */
productController.get(
  "/category/:categoryId",
  productService.getProductsByCategory
);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products (public)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */
productController.get("/", productService.getAllProducts);

/**
 * @swagger
 * /products/top-10-best-seller:
 *   get:
 *     summary: Get top 10 products by sales count
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of top 10 best-selling products
 */
productController.get("/top-10-best-seller", productService.getTop10Products);

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get product details (protected)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
productController.get(
  "/:productId",
  authentication,
  productService.getProductDetails
);

export { productController };
