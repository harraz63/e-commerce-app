import { Document, Schema } from "mongoose";
import { DiscountTypeEnum } from "../Enums";
import { IAddress } from "./user.interface";

export interface IProduct extends Document {
  name: string;
  description: String;
  imageKeys: string[];
  price: number;
  originalPrice: Number;
  colors?: [String];
  sizes?: [String];
  stock: number;
  bestSeller: boolean;
  category: Schema.Types.ObjectId;
  rating: Number;
  reviewCount: Number;
}

export interface ICategory {
  _id?: Schema.Types.ObjectId;
  name: string;
  description: String;
  parent: Schema.Types.ObjectId | null;
}

export interface ICart extends Document {
  user: Schema.Types.ObjectId;
  items: [
    {
      product: Schema.Types.ObjectId;
      quantity: number;
      color?: string;
      size?: string;
      price: number;
    }
  ];
  coupon?: Schema.Types.ObjectId;
}

export interface ICoupon {
  code: string;
  discountType: DiscountTypeEnum;
  discountValue: number;
  expiryDate: Date;
  isActive: boolean;
}

export interface IOrder {
  user: Schema.Types.ObjectId;
  items: [
    {
      product: Schema.Types.ObjectId;
      quantity: number;
      color?: string;
      size?: string;
      price: number;
    }
  ];
  coupon?: ICoupon;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  orderDate: Date;
  status: string;
  shippingAddress: IAddress;
}

export interface IWishlist {
  user: Schema.Types.ObjectId;
  products: Schema.Types.ObjectId[];
}
