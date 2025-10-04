import mongoose from "mongoose";
import { DiscountTypeEnum } from "../../Common";
import { ICoupon } from "../../Common/Interfaces";

const couponSchema = new mongoose.Schema<ICoupon>({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discountType: {
    type: String,
    enum: DiscountTypeEnum,
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const CouponModel = mongoose.model("Coupon", couponSchema);

export { CouponModel };
