import { BaseRepository } from "./base.repository";
import { IWishlist } from "../../Common";
import { Model, ProjectionType, QueryOptions, Types } from "mongoose";

export class WishlistRepository extends BaseRepository<IWishlist> {
  constructor(protected _wishlistModel: Model<IWishlist>) {
    super(_wishlistModel);
  }

  // Find Wishlist By Id
  async findWishlistById(
    id: Types.ObjectId,
    projection?: ProjectionType<IWishlist> | null,
    options?: QueryOptions<IWishlist>
  ): Promise<IWishlist | null> {
    return await this._wishlistModel.findById(id, projection, options);
  }

  // Find Wishlist By User
  async findWishlistByUser(
    user: Types.ObjectId,
    projection?: ProjectionType<IWishlist> | null,
    options?: QueryOptions<IWishlist>
  ): Promise<IWishlist | null> {
    return await this._wishlistModel.findOne({ user }, projection, options);
  }
}
