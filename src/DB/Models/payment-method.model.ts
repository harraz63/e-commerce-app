import mongoose, { Schema } from "mongoose";
import { IPaymentMethod, PaymentMethodsEnum } from "../../Common";

const paymentMethodSchema = new mongoose.Schema<IPaymentMethod>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: PaymentMethodsEnum,
    default: PaymentMethodsEnum.CASH,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  expiry: {
    type: String,
    required: true,
  },
  isDefault: Boolean,
});

const PaymentMethodModel = mongoose.model<IPaymentMethod>(
  "Payment",
  paymentMethodSchema
);

export { PaymentMethodModel };
