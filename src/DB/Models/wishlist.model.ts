import mongoose, { Schema, Types } from "mongoose";
import { IWishlist } from "../../Common";

const wishlistSchema = new mongoose.Schema<IWishlist>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    required: true,
    index: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const WishlistModel = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export { WishlistModel };
