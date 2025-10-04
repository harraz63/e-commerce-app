import { BaseRepository } from "./base.repository";
import { IOrder } from "../../Common";
import { Model } from "mongoose";

export class OrderRepository extends BaseRepository<IOrder> {
  constructor(protected _orderModel: Model<IOrder>) {
    super(_orderModel);
  }

  //Find Order By Id
  async findOrderById(id: string): Promise<IOrder | null> {
    return await this._orderModel.findById(id);
  }

  //Find All Order By User
  async findAllOrderByUser(user: string): Promise<IOrder[]> {
    return await this._orderModel.find({ user });
  }

  //Find Orders By Status
  async findOrdersByStatus(status: string): Promise<IOrder[]> {
    return await this._orderModel.find({ status });
  }
}
