import mongoose, { Schema } from "mongoose";
import { IAddress } from "../../Common";

const addressSchema = new mongoose.Schema<IAddress>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    reqired: true,
  },
  city: {
    type: String,
    reqired: true,
  },
  phone: {
    type: String,
    reqired: true,
  },
  email: String,
});

const AddressModel = mongoose.model<IAddress>("Address", addressSchema);

export { AddressModel };
