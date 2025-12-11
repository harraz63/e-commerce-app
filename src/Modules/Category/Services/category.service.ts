import { ICategory } from "../../../Common";
import { CategoryModel } from "../../../DB/Models";
import { CategoryRepository } from "../../../DB/Repositories";
import { Request, Response } from "express";
import {
  BadRequestException,
  NotFoundException,
  SuccessResponse,
} from "../../../Utils";
import mongoose from "mongoose";

class categoryService {
  private categoryRepo: CategoryRepository = new CategoryRepository(
    CategoryModel
  );

  // Add Category
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

  // Add Multiple Categories
  createCategories = async (req: Request, res: Response) => {
    const { categories }: { categories: ICategory[] } = req.body;

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      throw new BadRequestException("Categories array is required");
    }

    // Validate each category
    for (const cat of categories) {
      if (!cat.name || !cat.description) {
        throw new BadRequestException(
          "Each category must have a name and description"
        );
      }
    }

    // Add all categories to DB
    const createdCategories = await Promise.all(
      categories.map((cat) =>
        this.categoryRepo.createCategory({
          name: cat.name,
          description: cat.description,
          parent: cat.parent || null,
        })
      )
    );

    return res.json(
      SuccessResponse("Categories Added Successfully", 200, {
        categories: createdCategories,
      })
    );
  };

  // Get All Categories
  getAllCategories = async (req: Request, res: Response) => {
    // Get Categories From Cache (Redis)
    const categories = await this.categoryRepo.getAllCategories();
    return res.json(
      SuccessResponse("Categories Found", 200, {
        categories,
      })
    );
  };

  // Get Category Details By ID
  getCategoryById = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    if (!categoryId) throw new BadRequestException("Category ID Is Required");

    const category = await this.categoryRepo.findCategoryById(
      categoryId as unknown as mongoose.Types.ObjectId
    );
    if (!category) throw new NotFoundException("Category Not Found");
    return res.json(SuccessResponse("Category Found", 200, { category }));
  };
}

export default new categoryService();
