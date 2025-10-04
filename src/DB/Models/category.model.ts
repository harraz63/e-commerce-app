import mongoose, { Schema } from "mongoose";
import { ICategory } from "../../Common";

const categorySchema = new mongoose.Schema<ICategory>({
  name: String,
  description: String,
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});

const CategoryModel = mongoose.model<ICategory>("Category", categorySchema);

export { CategoryModel };
