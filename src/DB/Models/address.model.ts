import mongoose, { Schema } from "mongoose";
import { IAddress } from "../../Common";

const addressSchema = new mongoose.Schema<IAddress>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  street: {
    type: String,
    reqired: true,
  },
  city: {
    type: String,
    reqired: true,
  },
  contry: {
    type: String,
    reqired: true,
  },
});

// Prevent Duplicate Addresses For Same User
addressSchema.index(
  { user: 1, street: 1, city: 1, contry: 1 },
  { unique: true }
);

const AddressModel = mongoose.model<IAddress>("Address", addressSchema);

export { AddressModel };
