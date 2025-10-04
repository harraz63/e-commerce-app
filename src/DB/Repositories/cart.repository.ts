import { Model } from "mongoose";
import { ICart } from "../../Common";
import { BaseRepository } from "./base.repository";

export class CartRepository extends BaseRepository<ICart> {
  constructor(protected _cartModel: Model<ICart>) {
    super(_cartModel);
  }

  //Find Cart By Id
  async findCartById(id: string): Promise<ICart | null> {
    return await this._cartModel.findById(id);
  }

  //Find Cart By User
  async findCartByUser(user: string): Promise<ICart | null> {
    return await this._cartModel.findOne({ user });
  }
}
