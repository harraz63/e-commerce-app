import mongoose from "mongoose";
import { IProduct } from "../../Common";
import { S3ClientService } from "../../Utils";

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
    type: Number,
    required: true,
    default: 0,
  },
});

productSchema.index({ name: "text", description: "text" });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ bestSeller: 1 });
productSchema.index({ createdAt: -1 });

const s3Client = new S3ClientService();

productSchema.post("init", async function (docs) {
  const addSignedUrls = async (doc: any) => {
    if (doc?.imageKeys?.length) {
      try {
        const urls = await Promise.all(
          doc.imageKeys.map((key: string) => s3Client.getFileWithSignedUrl(key))
        );
        doc.imageUrls = urls;
      } catch (err) {
        console.error("Error generating signed URLs for product:", err);
      }
    }
  };

  if (Array.isArray(docs)) {
    await Promise.all(docs.map(addSignedUrls));
  } else if (docs) {
    await addSignedUrls(docs);
  }
});

const ProductModel = mongoose.model<IProduct>("Product", productSchema);

export { ProductModel };
