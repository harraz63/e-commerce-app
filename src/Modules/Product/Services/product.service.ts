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

  // FKN Add Product
  addProduct = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    let {
      name,
      description,
      price,
      originalPrice,
      colors,
      sizes,
      stock,
      category,
    }: IProduct = req.body;

    if (!files)
      throw new BadRequestException("Upload At least One Product Picture");

    // Check If The Product Is Already Added
    const isProductExist = await this.productRepo.findProductByName(name);
    if (isProductExist)
      throw new BadRequestException("This Product Is Already Added");

    // parse values
    price = Number(price);
    originalPrice = Number(originalPrice);
    stock = Number(stock);

    // Get Category ID By Name
    const categoryDoc = await this.categoryRepo.findCategoryByName(
      category as unknown as string
    );
    if (!categoryDoc) throw new NotFoundException("This Category Is Not Found");
    category = categoryDoc._id!;

    const productObject: Partial<IProduct> = {
      name,
      description,
      price,
      originalPrice,
      colors,
      sizes,
      stock,
      category,
      imageKeys: [],
    };

    // Check Required Fields And Set Product Properties In Product Object
    if (!name) throw new BadRequestException("Product Name Is Required");
    if (!description) throw new BadRequestException("Description Is Required");
    if (!price) throw new BadRequestException("Price Is Required");
    if (!originalPrice)
      throw new BadRequestException("Original Price Is Required");
    if (!stock)
      throw new BadRequestException("Product Stock Amount Is Required");
    if (!category) throw new BadRequestException("Category Is Required");

    productObject.name = name;
    productObject.description = description;
    productObject.price = price;
    productObject.originalPrice = originalPrice;
    productObject.stock = stock;
    productObject.category = category;
    if (colors) productObject.colors = colors;
    if (sizes) productObject.sizes = sizes;

    // Upload Product Pictures
    const images = await this.s3Client.uploadMultipleFilesOnS3(
      files as unknown as Express.Multer.File[],
      "product-pictures"
    );

    productObject.imageKeys = images.map((image) => image.key);

    // Add Product To DB
    const porduct = await this.productRepo.addProduct(productObject);

    return res.json(
      SuccessResponse("Product Added Successfully", 200, porduct)
    );
  };

  // FKN Update Product
  updateProduct = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { name, description, price, originalPrice, colors, sizes, stock } =
      req.body;

    const product = await this.productRepo.findProductById(productId);
    if (!product) throw new NotFoundException("Product Not Found");

    // Update It
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (originalPrice) product.originalPrice = originalPrice;
    if (colors) product.colors = colors;
    if (sizes) product.sizes = sizes;
    if (stock) product.stock = stock;

    await product.save();

    return res.json(
      SuccessResponse("Product Updated Successfully", 200, product)
    );
  };

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
      throw new NotFoundException("There Are No Products");
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

  // Delete Product
  deleteProduct = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;
    const { productId } = req.params;

    const product = await this.productRepo.findProductById(productId);
    if (!product) throw new NotFoundException("Product Not Found");

    // Delete This Product And Delete His Images From AWS S3
    await Promise.all(
      product.imageKeys.map((key) => {
        this.s3Client.deleteFileFromS3(key);
      })
    );
    await product.deleteOne();

    return res.json(SuccessResponse("Product Deleted Successfully", 200));
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
      throw new NotFoundException("No Products Founded In This Category");
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
      throw new NotFoundException("No Products Found Matching This Name");
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
      throw new NotFoundException("No Best Seller Products Found");
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
      throw new NotFoundException("No Related Products Found");
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
