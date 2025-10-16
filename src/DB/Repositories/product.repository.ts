import { Model } from "mongoose";
import { IProduct } from "../../Common";
import { BaseRepository } from "./base.repository";

export class ProductRepository extends BaseRepository<IProduct> {
  constructor(protected _productModel: Model<IProduct>) {
    super(_productModel);
  }

  // Get all products with filters, pagination, and sorting
  async findAllProducts(
    filters: any = {},
    pagination: { skip?: number; limit?: number } = {},
    sorting: any = {}
  ): Promise<IProduct[]> {
    const skip = pagination.skip ?? 0; // default 0
    const limit = pagination.limit ?? 10; // default 10

    return await this._productModel
      .find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sorting)
      .populate("category", "name");
  }

  // Get By Best Seller
  async findBestSellerProducts(): Promise<IProduct[]> {
    return await this._productModel.find({ bestSeller: true });
  }

  //Find Product By Id
  async findProductById(id: string): Promise<IProduct | null> {
    return await this._productModel.findById(id).populate("category", "name");
  }

  //Find Product By Name
  async findProductByName(name: string): Promise<IProduct | null> {
    return await this._productModel.findOne({ name });
  }

  //Find Products By Name
  async findProductsByName(name: string): Promise<IProduct[]> {
    return await this._productModel.find({ name });
  }

  //Find Products By Category
  async findProductsByCategory(category: string): Promise<IProduct[]> {
    return await this._productModel.find({ category });
  }

  //Find Products By Brand
  async findProductsByBrand(brand: string): Promise<IProduct[]> {
    return await this._productModel.find({ brand });
  }

  //Find Products By Rating
  async findProductsByRating(rating: number): Promise<IProduct[]> {
    return await this._productModel.find({ rating });
  }

  // Update Product
  async updateProduct(
    id: string,
    product: Partial<IProduct>,
    options: any
  ): Promise<IProduct | null> {
    return await this._productModel.findByIdAndUpdate(id, product, options);
  }

  // Add Product
  async addProduct(product: Partial<IProduct>): Promise<IProduct> {
    return await this._productModel.create(product);
  }
}
