import { Router } from "express";
import categoryService from "./Services/category.service";
import { authentication } from "../../Middlewares";
import { authorizationMiddleware } from "../../Middlewares/authorization.middleware";
import { RoleEnum } from "../../Common";

const categoriesController = Router();

// Add Category
categoriesController.post(
  "/",
  authentication,
  authorizationMiddleware([RoleEnum.ADMIN]),
  categoryService.createCategory
);

// Get All Categories
categoriesController.get("/", authentication, categoryService.getAllCategories);

// Get Category Details By ID
categoriesController.get("/:categoryId", authentication, categoryService.getCategoryById);

export { categoriesController };
