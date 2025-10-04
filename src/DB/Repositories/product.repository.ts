import { Model } from "mongoose";
import { IProduct } from "../../Common";
import { BaseRepository } from "./base.repository";

export class ProductRepository extends BaseRepository<IProduct> {
  constructor(protected _productModel: Model<IProduct>) {
    super(_productModel);
  }

  // Get all products with filters, pagination, and sorting
  async getAllProducts(
    filters: any,
    pagination: any,
    sorting: any
  ): Promise<IProduct[]> {
    return await this._productModel
      .find(filters)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sorting);
  }

  // Get By Best Seller
  async getBestSellerProducts(): Promise<IProduct[]> {
    return await this._productModel.find({ bestSeller: true });
  }

  //Find Product By Id
  async findProductById(id: string): Promise<IProduct | null> {
    return await this._productModel.findById(id);
  }

  //Find Prodeuct By Name
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
}
