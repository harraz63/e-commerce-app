import mongoose, { Schema } from "mongoose";
import { GenderEnum, IUser, ProviderEnum, RoleEnum } from "../../Common";
import { email } from "zod";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: {
        unique: true,
        name: "idx_email_unique",
      },
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: RoleEnum,
      default: RoleEnum.USER,
    },
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    paymentMethods: [
      {
        type: Schema.Types.ObjectId,
        ref: "PaymentMethod",
      },
    ],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    gender: {
      type: String,
      enum: GenderEnum,
      default: GenderEnum.OTHER,
    },
    provider: {
      type: String,
      enum: ProviderEnum,
      default: ProviderEnum.LOCAL,
    },
    googleId: String,
    isVerified: Boolean,
    age: Number,
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ googleId: 1 }, { unique: true, sparse: true });
userSchema.index({ email: 1, provider: 1 });

const UserModel = mongoose.model<IUser>("User", userSchema);

export { UserModel };
