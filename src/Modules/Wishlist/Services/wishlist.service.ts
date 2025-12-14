import { Request, Response } from "express";
import { IRequest } from "../../../Common";
import {
  BadRequestException,
  NotFoundException,
  S3ClientService,
  SuccessResponse,
} from "../../../Utils";
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
  private s3Client = new S3ClientService();

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
  getWishlist = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;

    // Get The Wishlist Date From DB
    const wishlist = await this.wishlistRepo.findWishlistByUser(
      userId,
      {},
      {
        populate: [
          { path: "user", select: "_id firstName lastName email" },
          { path: "products" },
        ],
      }
    );
    if (!wishlist) throw new NotFoundException("Wishlist Not Found");

    // Convert to plain object to allow modifications
    const wishListObj = wishlist.toObject();

    await Promise.all(
      wishListObj.products.map(async (item: any) => {
        if (item.imageKeys?.length) {
          // Get only the first image
          item.image = await this.s3Client.getFileWithSignedUrl(
            item.imageKeys[0]
          );
        } else {
          item.image = null;
        }

        delete item.imageKeys;
      })
    );

    return res.json(
      SuccessResponse("Wishlist Fetched Successfully", 200, { wishListObj })
    );
  };

  // Delete From Wishlist
  deleteProductFromWishlist = async (req: Request, res: Response) => {
    const {
      user: { _id: userId },
    } = (req as IRequest).loggedInUser;
    const { wishlistId, productId } = req.body;
    if (!productId) throw new BadRequestException("Product ID Is Required");

    // Get The User Wishlist
    const wishlist = await this.wishlistRepo.findOneDocument({
      user: userId as Types.ObjectId,
      _id: wishlistId as Types.ObjectId,
      products: { $in: [productId as Types.ObjectId] },
    });
    if (!wishlist) throw new NotFoundException("Wishlist Not Found");

    // Delete The Product From Wishlist
    let newProducts: Types.ObjectId[] = [];
    wishlist.products.filter((product) => {
      if (product._id.toString() !== productId.toString()) {
        newProducts.push(product);
      }
    });

    wishlist.products = newProducts;
    wishlist.save();

    return res.json(
      SuccessResponse("Product Deleted From Wishlist Successfully", 200, {
        wishlist,
      })
    );
  };
}

export default new wishlistService();
