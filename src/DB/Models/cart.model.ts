import mongoose, { Schema } from "mongoose";
import { ICart } from "../../Common";
import { S3ClientService } from "../../Utils";

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
    totalPrice: {
      type: Number,
      default: 0, // will be recalculated before save
    },
  },

  { timestamps: true }
);

// Pre-save hook to calculate totalPrice
cartSchema.pre("save", function (next) {
  const cart = this;

  cart.totalPrice = cart.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  next();
});

const CartModel = mongoose.model("Cart", cartSchema);

export { CartModel };
