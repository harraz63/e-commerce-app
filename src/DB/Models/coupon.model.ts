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
  expiresAt: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// TTl Delete Document After The Expiration Date
couponSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Sync expiresAt With expiresDate Before Saving
couponSchema.pre("save", function (next) {
  this.expiresAt = this.expiryDate;
  next();
});

const CouponModel = mongoose.model("Coupon", couponSchema);

export { CouponModel };
