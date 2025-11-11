import mongoose, { Types } from "mongoose";
import { ICategory, ICoupon, IProduct, IRequest } from "../../../Common";
import { CategoryModel, CouponModel, ProductModel } from "../../../DB/Models";
import {
  CategoryRepository,
  CouponRepository,
  ProductRepository,
} from "../../../DB/Repositories";
import {
  BadRequestException,
  NotFoundException,
  S3ClientService,
  SuccessResponse,
} from "../../../Utils";

import { Request, Response } from "express";

class adminServices {
  private categoryRepo: CategoryRepository = new CategoryRepository(
    CategoryModel
  );
  private s3Client = new S3ClientService();
  private productRepo: ProductRepository = new ProductRepository(ProductModel);
  private couponRepo: CouponRepository = new CouponRepository(CouponModel);

  // Create Category
  createCategory = async (req: Request, res: Response) => {
    const { name, description, parent }: ICategory = req.body;
    if (!name || !description)
      throw new BadRequestException("Both Name And Description Are Required");

    // Add The Categories To DB
    const category = await this.categoryRepo.createCategory({
      name,
      description,
      parent,
    });

    return res.json(
      SuccessResponse("Category Added Successfully", 200, { category })
    );
  };

  // Delete Category
  deleteCategory = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;
    const { categoryId } = req.params;

    if (!categoryId) throw new BadRequestException("Category ID Is Required");

    await this.categoryRepo.deleteByIdDocument(
      categoryId as unknown as Types.ObjectId
    );

    return res.json(SuccessResponse("Category Deleted Successfully", 200));
  };

  // Add Product
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

  // Update Product
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

  // List All Products
  listAllProducts = async (req: Request, res: Response) => {
    const products = await this.productRepo.findAllProducts();
    if (!products) throw new NotFoundException("Products Not Found");

    return res.json(
      SuccessResponse("Products Fetched Successfully", 200, { products })
    );
  };

  // Add Coupon
  addCoupon = async (req: Request, res: Response) => {
    const { code, discountType, discountValue, expiryDate, isActive }: ICoupon =
      req.body;

    // Check If Coupon Is Already Exist
    const isCouponExist = await this.couponRepo.findCouponByCode(code);
    if (isCouponExist)
      throw new BadRequestException("This Coupon Is Already Added");

    // Add Coupon To DB
    const coupon = await this.couponRepo.createCoupon({
      code,
      discountType,
      discountValue,
      expiryDate,
      isActive,
    });

    return res.json(
      SuccessResponse("Coupon Added Successfully", 200, { coupon })
    );
  };

  // Delete Coupon
  deleteCoupon = async (req: Request, res: Response) => {
    const { couponId } = req.params;
    if (!couponId) throw new BadRequestException("Coupon ID Is Required");

    const deletedCoupon = await this.couponRepo.findByIdAndDeleteDocument(
      couponId as unknown as mongoose.Types.ObjectId
    );
    if (!deletedCoupon) throw new NotFoundException("Coupon Not Found");

    return res.json(SuccessResponse("Coupon Deleted Successfully", 200));
  };
}
export default new adminServices();
