import mongoose, { Schema } from "mongoose";
import {
  IPaymentMethod,
  PaymentGatewaysEnum,
  PaymentMethodsEnum,
} from "../../Common";

const paymentMethodSchema = new mongoose.Schema<IPaymentMethod>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gateway: {
      type: String,
      enum: PaymentGatewaysEnum,
      default: PaymentGatewaysEnum.STRIPE,
      required: true,
    },
    pmId: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: PaymentMethodsEnum,
      required: true,
    },
    last4: {
      type: String,
      required: true,
    },
    exp_month: {
      type: String,
      required: true,
    },
    exp_year: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentMethodModel = mongoose.model<IPaymentMethod>(
  "Payment",
  paymentMethodSchema
);

export { PaymentMethodModel };
