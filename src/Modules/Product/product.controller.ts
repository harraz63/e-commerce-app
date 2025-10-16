import { Router } from "express";
import productService from "./Services/product.service";
import { authentication, Multer } from "../../Middlewares";

const productController = Router();

// Search By Product Name (public)
productController.get("/search", productService.searchByProductName);

// Get Best Selling Products
productController.get("/best-selling", productService.getBestSelling);

// Get Related Products
productController.get("/related-products/:productId", productService.getRelatedProducts)

// Get Products By Category (public)
productController.get(
  "/category/:categoryId",
  productService.getProductsByCategory
);

// Get Product Details (protected)
productController.get(
  "/:productId",
  authentication,
  productService.getProductDetails
);

// Update Product (protected)
productController.put(
  "/:productId",
  authentication,
  Multer().array("productPictures"),
  productService.updateProduct
);

// Delete Product (protected)
productController.delete(
  "/:productId",
  authentication,
  productService.deleteProduct
);

// Get All Products (public)
productController.get("/", productService.getAllProducts);

// Add Product (protected)
productController.post(
  "/",
  authentication,
  Multer().array("productPictures"),
  productService.addProduct
);



export { productController };
