import { Model, Types } from "mongoose";
import { ICart } from "../../Common";
import { BaseRepository } from "./base.repository";

export class CartRepository extends BaseRepository<ICart> {
  constructor(protected _cartModel: Model<ICart>) {
    super(_cartModel);
  }

  // Find Cart By Id
  async findCartById(id: Types.ObjectId): Promise<ICart | null> {
    return await this._cartModel.findById(id);
  }

  // Find Cart By User ID
  async findCartByUser(userId: Types.ObjectId): Promise<ICart | null> {
    return await this._cartModel.findOne({ userId });
  }
}
