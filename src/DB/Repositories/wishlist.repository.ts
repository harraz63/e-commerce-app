import { BaseRepository } from "./base.repository";
import { IWishlist } from "../../Common";
import { Model, Types } from "mongoose";

export class WishlistRepository extends BaseRepository<IWishlist> {
  constructor(protected _wishlistModel: Model<IWishlist>) {
    super(_wishlistModel);
  }

  // Find Wishlist By Id
  async findWishlistById(id: Types.ObjectId): Promise<IWishlist | null> {
    return await this._wishlistModel.findById(id);
  }

  // Find Wishlist By User
  async findWishlistByUser(user: Types.ObjectId): Promise<IWishlist | null> {
    return await this._wishlistModel.findOne({ user });
  }
}
