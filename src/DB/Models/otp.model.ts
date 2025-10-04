import mongoose from "mongoose";
import { IOTP, OtpTypesEnum } from "../../Common";

const otpSchema = new mongoose.Schema<IOTP>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    value: { type: String, required: true },
    otpType: {
      type: String,
      enum: Object.values(OtpTypesEnum),
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      index: { expires: "10m" }, // TTL Index
    },
  },
  { timestamps: true }
);

const OtpModel = mongoose.model<IOTP>("Otp", otpSchema);

export { OtpModel };
