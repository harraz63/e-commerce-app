import { Request, Response } from "express";
import { IRequest } from "../../../Common";
import { BadRequestException, SuccessResponse } from "../../../Utils";
import {
  ProductRepository,
  WishlistRepository,
} from "../../../DB/Repositories";
import { ProductModel } from "../../../DB/Models";
import { WishlistModel } from "../../../DB/Models/wishlist.model";
import { Types } from "mongoose";

class wishlistService {
  private productRepo: ProductRepository = new ProductRepository(ProductModel);
  private wishlistRepo: WishlistRepository = new WishlistRepository(
    WishlistModel
  );

  // Add To Wishlist
  addToWishlist = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;

    const { productId } = req.params;
    if (!productId) throw new BadRequestException("Product ID Is Required");
    if (!Types.ObjectId.isValid(productId))
      throw new BadRequestException("Invalid Product ID Format");

    // Check product exists
    const product = await this.productRepo.findProductById(productId);
    if (!product) throw new BadRequestException("Product Not Found");

    // High-performance atomic update:
    const wishlist = await this.wishlistRepo.findAndUpdateDocument(
      { user: userId },
      {
        $addToSet: { products: new Types.ObjectId(productId) }, // prevents duplicates
        $setOnInsert: { user: userId }, // only if created
      },
      {
        new: true,
        upsert: true,
        populate: [
          {
            path: "products",
            select: "_id name description price category rating bestSeller",
          },
        ],
      } // create if not exists
    );

    return res.json(
      SuccessResponse("Product Added Successfully To Wishlist", 201, {
        wishlist,
      })
    );
  };

  // Get Wishlist Data
  getWishlist = async (req: Request, res: Response) => {};
}

export default new wishlistService();
