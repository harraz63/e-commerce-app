import mongoose, { Schema } from "mongoose";
import { IOrder } from "../../Common/Interfaces";

const orderSchema = new mongoose.Schema<IOrder>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
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
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  trackingNumber: {
    type: String,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
  },
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
});

const OrderModel = mongoose.model("Order", orderSchema);

export { OrderModel };
