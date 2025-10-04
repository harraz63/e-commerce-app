import mongoose, { Document, Types } from "mongoose";
import {
  GenderEnum,
  OtpTypesEnum,
  PaymentMethodsEnum,
  ProviderEnum,
  RoleEnum,
} from "../Enums";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { IProduct } from "./product.interface";

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: RoleEnum;
  addresses: (Types.ObjectId | IAddress)[];
  paymentMethods: (Types.ObjectId | IPaymentMethod)[];
  wishlist: (Types.ObjectId | IProduct)[];
  gender: GenderEnum;
  DOB?: Date;
  provider: ProviderEnum;
  googleId?: string;
  isVerified?: boolean;
  age?: number;
  isConfirmed: boolean;
}

export interface IAddress {
  user: Types.ObjectId | IUser;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  contry: string;
  phone: string;
  email: string;
}

export interface IPaymentMethod {
  user: Types.ObjectId | IUser;
  type: PaymentMethodsEnum;
  cardNumber: string;
  expiry: string;
  isDefault: boolean;
}

export interface IEmailArgument {
  to: string;
  cc?: string;
  subject: string;
  content: string;
  attachments?: string[];
}

export interface IOTP {
  userId: mongoose.Types.ObjectId;
  value: string;
  otpType: OtpTypesEnum;
  expiresAt: Date;
}

export interface ITokenPayload {
  _id: string;
  role: RoleEnum;
  email: string;
  isVerified?: boolean;
  jti?: boolean;
}

export interface IRequest extends Request {
  loggedInUser: {
    user: IUser;
    token: JwtPayload;
    tokenId: string;
    expirationDate: Date | null;
  };
}

export interface IBlackListedToken extends Document {
  tokenId: string;
  expiresAt: Date;
}
