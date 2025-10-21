import mongoose, { Schema } from "mongoose";
import { ICart } from "../../Common";
import { S3ClientService } from "../../Utils";

const cartSchema = new mongoose.Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: {
          type: String,
          default: null,
        },
        size: {
          type: String,
          default: null,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
  },
  { timestamps: true }
);

// cartSchema.pre<mongoose.Query<any, any>>(/^find/, function (next) {
//   this.populate({
//     path: "items.product",
//     select: "-colors -sizes -stock -reviewCount",
//   }).populate({
//     path: "coupon",
//   });
//   next();
// });

// const s3Client = new S3ClientService();
// cartSchema.post(/^find/, async function (docs: any) {
//   const documents = Array.isArray(docs) ? docs : [docs];

//   for (const doc of documents) {
//     if (doc?.items?.length) {
//       for (const item of doc.items) {
//         const product = item.product;
//         if (product?.imageKeys?.length) {
//           product.imageUrls = await Promise.all(
//             product.imageKeys.map((key: string) =>
//               s3Client.getFileWithSignedUrl(key)
//             )
//           );
//         }
//       }
//     }
//   }
// });

const CartModel = mongoose.model("Cart", cartSchema);

export { CartModel };
