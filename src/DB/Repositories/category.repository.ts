import { Model, Types } from "mongoose";
import { ICategory } from "../../Common";
import { BaseRepository } from "./base.repository";

export class CategoryRepository extends BaseRepository<ICategory> {
  constructor(protected _categoryModel: Model<ICategory>) {
    super(_categoryModel);
  }

  //Find Category By Id
  async findCategoryById(id: Types.ObjectId): Promise<ICategory | null> {
    return await this._categoryModel.findById(id);
  }

  //Find Category By Name
  async findCategoryByName(name: string): Promise<ICategory | null> {
    return await this._categoryModel.findOne({ name });
  }

  // Create Category
  async createCategory(category: ICategory): Promise<ICategory> {
    return await this._categoryModel.create(category);
  }

  // Get All Categories
  async getAllCategories(): Promise<ICategory[]> {
    return await this._categoryModel.find();
  }
}
