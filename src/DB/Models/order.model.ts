import mongoose, { Schema, Types } from "mongoose";
import { IOrder } from "../../Common/Interfaces";
import { orderStatusEnum, paymentMethodEnum } from "../../Common";

const orderSchema = new mongoose.Schema<IOrder>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  arriveAt: {
    type: Date,
    default: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days from now
  },
  phone: {
    type: String,
  },
  totalAmount: {
    type: Number,
  },
  paymentMethod: {
    type: String,
    enum: paymentMethodEnum,
    default: paymentMethodEnum.CASH,
    required: true,
  },
  paymentIntent: {
    type: String
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
    enum: Object.values(orderStatusEnum),
    default: orderStatusEnum.PENDING,
  },
  address: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const OrderModel = mongoose.model("Order", orderSchema);

export { OrderModel };
