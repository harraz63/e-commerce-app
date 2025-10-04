import { BaseRepository } from "./base.repository";
import { IWishlist } from "../../Common";
import { Model } from "mongoose";

export class WishlistRepository extends BaseRepository<IWishlist> {
  constructor(protected _wishlistModel: Model<IWishlist>) {
    super(_wishlistModel);
  }

  //Find Wishlist By Id
  async findWishlistById(id: string): Promise<IWishlist | null> {
    return await this._wishlistModel.findById(id);
  }

  //Find Wishlist By User
  async findWishlistByUser(user: string): Promise<IWishlist | null> {
    return await this._wishlistModel.findOne({ user });
  }
}
