import { Router } from "express";
import categoryService from "./Services/category.service";
import { authentication } from "../../Middlewares";

const categoriesController = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Product Categories Management
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all categories
 *       401:
 *         description: Unauthorized
 */
categoriesController.get("/", authentication, categoryService.getAllCategories);

/**
 * @swagger
 * /categories/{categoryId}:
 *   get:
 *     summary: Get category details by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Category details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
categoriesController.get("/:categoryId", authentication, categoryService.getCategoryById);

export { categoriesController };
