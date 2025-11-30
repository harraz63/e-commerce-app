import { Model, QueryOptions, Types } from "mongoose";
import { ICart } from "../../Common";
import { BaseRepository } from "./base.repository";
import { ProjectionType } from "mongoose";

export class CartRepository extends BaseRepository<ICart> {
  constructor(protected _cartModel: Model<ICart>) {
    super(_cartModel);
  }

  // Find Cart By Id
  async findCartById(id: Types.ObjectId): Promise<ICart | null> {
    return await this._cartModel.findById(id);
  }

  // Find Cart By User ID
  async findCartByUser(
    id: Types.ObjectId,
    project?: ProjectionType<ICart>,
    options?: QueryOptions<ICart>
  ): Promise<ICart | null> {
    return await this._cartModel.findOne({ user: id }, project, options);
  }

  // Create Cart For User
  async createCart(id: Types.ObjectId): Promise<ICart> {
    return await this._cartModel.create({ user: id, items: [] });
  }
}
