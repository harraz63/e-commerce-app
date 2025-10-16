import mongoose, { Schema } from "mongoose";
import { ICart } from "../../Common";

const cartSchema = new mongoose.Schema<ICart>(
  {
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
          default: null,
        },
        size: {
          type: String,
          default: null,
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
  },
  { timestamps: true }
);

const CartModel = mongoose.model("Cart", cartSchema);

export { CartModel };
