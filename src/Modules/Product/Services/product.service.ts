import { Request, Response } from "express";
import { IProduct, IRequest } from "../../../Common";
import {
  BadRequestException,
  NotFoundException,
  S3ClientService,
  SuccessResponse,
} from "../../../Utils";
import {
  CategoryRepository,
  ProductRepository,
} from "../../../DB/Repositories";
import { CategoryModel, ProductModel } from "../../../DB/Models";
import mongoose from "mongoose";

class productService {
  private s3Client = new S3ClientService();
  private productRepo: ProductRepository = new ProductRepository(ProductModel);
  private categoryRepo: CategoryRepository = new CategoryRepository(
    CategoryModel
  );

  // Get Product Details
  getProductDetails = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;
    const { productId } = req.params;

    const product = await this.productRepo.findProductById(productId);
    if (!product) throw new NotFoundException("Product Not Found");

    // Prepare Product Images By Kyes
    const productImages = await Promise.all(
      product.imageKeys.map((image) =>
        this.s3Client.getFileWithSignedUrl(image)
      )
    );

    const productDetails = {
      _id: product._id,
      name: product.name,
      description: product.description,
      images: productImages,
      price: product.price,
      originalPrice: product.originalPrice,
      colors: product.colors,
      sizes: product.sizes,
      stock: product.stock,
      isBestSeller: product.bestSeller,
      category: product.category,
      rating: product.rating,
      reviewCount: product.reviewCount,
    };

    return res.json(
      SuccessResponse("Product Details Fetched Successfully", 200, {
        productDetails,
      })
    );
  };

  // Get All Products
  getAllProducts = async (req: Request, res: Response) => {
    const products = await this.productRepo.findAllProducts();
    if (!products || products.length === 0) {
      return res.json(
        SuccessResponse("Products Fetched Successfully", 200, {
          products: [],
        })
      );
    }

    const safeProducts = await Promise.all(
      products.map(async (product) => {
        // map each imageKey to a signed URL
        const imageUrls = await Promise.all(
          product.imageKeys.map((key) =>
            this.s3Client.getFileWithSignedUrl(key)
          )
        );

        const { imageKeys, ...rest } = product.toObject();
        return {
          ...rest,
          images: imageUrls, // now contains actual signed URLs
        };
      })
    );

    return res.json(
      SuccessResponse("Products Fetched Successfully", 200, {
        products: safeProducts,
      })
    );
  };

  // Get Products By Category
  getProductsByCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    const category = await this.categoryRepo.findCategoryById(
      categoryId as unknown as mongoose.Types.ObjectId
    );
    if (!category) throw new NotFoundException("Category Not Found");

    const products = await this.productRepo.findProductsByCategory(categoryId);
    if (!products || products.length === 0) {
      return res.json(
        SuccessResponse("Category Products Fetched Successfully", 200, {
          products: [],
        })
      );
    }

    const safeProducts = await Promise.all(
      products.map(async (product) => {
        const images = await Promise.all(
          product.imageKeys.map((key) =>
            this.s3Client.getFileWithSignedUrl(key)
          )
        );

        const { imageKeys, ...rest } = product.toObject();
        return {
          ...rest,
          images,
          category: category.name,
        };
      })
    );

    return res.json(
      SuccessResponse("Category Products Fetched Successfully", 200, {
        products: safeProducts,
      })
    );
  };

  // Search By Product Name
  searchByProductName = async (req: Request, res: Response) => {
    const { name: productName } = req.query;
    if (!productName)
      throw new BadRequestException("Product Name Is Required For Search");

    // Build Filter
    const filter = { name: { $regex: productName, $options: "i" } };

    // Get Matching Products
    const products = await this.productRepo.findAllProducts(filter);
    if (!products || products.length === 0) {
      return res.json(
        SuccessResponse("Products Fetched Successfully", 200, {
          products: [],
        })
      );
    }

    const safeProducts = await Promise.all(
      products.map(async (product) => {
        const images = await Promise.all(
          product.imageKeys.map((key) =>
            this.s3Client.getFileWithSignedUrl(key)
          )
        );

        const { imageKeys, ...rest } = product.toObject();
        return {
          ...rest,
          images,
        };
      })
    );

    return res.json(
      SuccessResponse("Products Fetched Successfully", 200, {
        products: safeProducts,
      })
    );
  };

  // Get Best Selling Products
  getBestSelling = async (req: Request, res: Response) => {
    const products = await this.productRepo.findBestSellerProducts();
    if (!products || products.length === 0) {
      return res.json(
        SuccessResponse("Best Seller Products Fetched Successfully", 200, {
          products: [],
        })
      );
    }

    // Prepare Images Urls
    const safeProducts = await Promise.all(
      products.map(async (product) => {
        const images = await Promise.all(
          product.imageKeys.map((key) =>
            this.s3Client.getFileWithSignedUrl(key)
          )
        );

        const { imageKeys, ...rest } = product.toObject();
        return {
          ...rest,
          images,
        };
      })
    );

    return res.json(
      SuccessResponse("Best Seller Products Fetched Successfully", 200, {
        products: safeProducts,
      })
    );
  };

  // Get Related Products
  getRelatedProducts = async (req: Request, res: Response) => {
    const { productId } = req.params;
    if (!productId) throw new BadRequestException("Product ID Is Required");

    // Get Product Category ID
    const product = await this.productRepo.findProductById(productId);
    if (!product) throw new NotFoundException("Product Not Found");
    const categortId = product.category;

    // Get Related Products
    const relatedProducts = await this.productRepo.findAllProducts({
      category: categortId,
      _id: { $ne: productId },
    });
    if (!relatedProducts || relatedProducts.length === 0) {
      return res.json(
        SuccessResponse("Related Products Fetched Successfully", 200, {
          relatedProducts: [],
        })
      );
    }

    const safeProducts = await Promise.all(
      relatedProducts.map(async (product) => {
        const images = await Promise.all(
          product.imageKeys.map((key) =>
            this.s3Client.getFileWithSignedUrl(key)
          )
        );

        const { imageKeys, ...rest } = product.toObject();
        return {
          ...rest,
          images,
        };
      })
    );

    return res.json(
      SuccessResponse("Related Products Fetched Successfully", 200, {
        relatedProducts: safeProducts,
      })
    );
  };
}

export default new productService();
