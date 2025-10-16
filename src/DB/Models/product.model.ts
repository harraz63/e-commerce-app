import mongoose from "mongoose";
import { IProduct } from "../../Common";

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageKeys: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  colors: {
    type: [String],
    required: true,
  },
  sizes: {
    type: [String],
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  reviewCount: {
    type: Number,
    required: true,
    default: 0,
  },
  bestSeller: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const ProductModel = mongoose.model<IProduct>("Product", productSchema);

export { ProductModel };
