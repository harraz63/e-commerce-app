import { Document, Schema, Types } from "mongoose";
import { DiscountTypeEnum, orderStatusEnum } from "../Enums";
import { IAddress } from "./user.interface";

export interface IProduct extends Document {
  name: string;
  description: String;
  imageKeys: string[];
  price: number;
  originalPrice: Number;
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
      price: number;
    }
  ];
  totalPrice: number;
  coupon?: Schema.Types.ObjectId;
}

export interface ICoupon {
  code: string;
  discountType: DiscountTypeEnum;
  discountValue: number;
  expiryDate: Date;
  expiresAt?: Date;
  isActive: boolean;
}

// For retrieved orders (with Document properties)
export interface IOrder extends Document {
  user: Schema.Types.ObjectId;
  cart: Schema.Types.ObjectId;
  arriveAt?: Date;
  phone: string;
  totalAmount?: number;
  paymentMethod: string;
  trackingNumber?: string;
  orderDate?: Date;
  status?: orderStatusEnum;
  address: string | IAddress;
}

// For creating orders (without Document properties)
export interface IOrderCreate {
  user: Schema.Types.ObjectId;
  cart: Schema.Types.ObjectId;
  phone: string;
  paymentMethod: string;
  address: string;
  arriveAt?: Date;
  totalAmount?: number;
  trackingNumber?: string;
  orderDate?: Date;
  status?: orderStatusEnum;
}

export interface IWishlist extends Document {
  user: Types.ObjectId;
  products: Types.ObjectId[];
}
