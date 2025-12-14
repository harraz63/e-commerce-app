import { Router } from "express";
import productService from "./Services/product.service";
import { authentication, Multer } from "../../Middlewares";

const productController = Router();

// Search By Product Name (public)
productController.get("/search", productService.searchByProductName);

// Get Related ProductsF
productController.get(
  "/related-products/:productId",
  productService.getRelatedProducts
);

// Get Products By Category (public)
productController.get(
  "/category/:categoryId",
  productService.getProductsByCategory
);

// Get All Products
productController.get("/", productService.getAllProducts);

// Get Top 10  Products By Sales Count
productController.get("/top-10-best-seller", productService.getTop10Products);

// Get Product Details (protected)
productController.get(
  "/:productId",
  authentication,
  productService.getProductDetails
);

export { productController };
