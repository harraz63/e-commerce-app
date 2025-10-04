import mongoose, { Schema } from "mongoose";
import { ICart } from "../../Common";

const cartSchema = new mongoose.Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      color: {
        type: String,
      },
      size: {
        type: String,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  coupon: {
    type: Schema.Types.ObjectId,
    ref: "Coupon",
    default: null,
  },
});

const CartModel = mongoose.model("Cart", cartSchema);

export { CartModel };
