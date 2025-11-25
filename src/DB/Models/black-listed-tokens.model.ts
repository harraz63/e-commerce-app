import mongoose from "mongoose";
import { IBlackListedToken } from "../../Common/Interfaces";

const blackListedSchema = new mongoose.Schema<IBlackListedToken>({
  tokenId: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

blackListedSchema.index({ tokenId: 1 }, { unique: true });

const BlackListedModel = mongoose.model<IBlackListedToken>(
  "BlackListedTokens",
  blackListedSchema
);

export { BlackListedModel };
