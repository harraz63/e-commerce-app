import mongoose from "mongoose";
import { IWishlist } from "../../Common";

const wishlistSchema = new mongoose.Schema<IWishlist>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
});

const WishlistModel = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export { WishlistModel };
