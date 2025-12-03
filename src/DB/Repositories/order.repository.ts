import { BaseRepository } from "./base.repository";
import { IOrder, IOrderCreate, orderStatusEnum } from "../../Common";
import { Model, ProjectionType, QueryOptions, Types } from "mongoose";

export class OrderRepository extends BaseRepository<IOrder> {
  constructor(protected _orderModel: Model<IOrder>) {
    super(_orderModel);
  }

  // Create Order
  async createOrder(orderData: IOrderCreate): Promise<IOrder> {
    return await this._orderModel.create(orderData);
  }

  // Find Order By Id
  async findOrderById(
    id: Types.ObjectId,
    project?: ProjectionType<IOrder>,
    options?: QueryOptions<IOrder>
  ): Promise<IOrder | null> {
    return await this._orderModel.findById(id, project, options);
  }

  // Find All Order By User
  async findAllOrderByUser(
    user: Types.ObjectId,
    project?: ProjectionType<IOrder>,
    options?: QueryOptions<IOrder>
  ): Promise<IOrder[]> {
    return await this._orderModel.find({ user }, project, options);
  }

  // Find Orders By Status
  async findOrdersByStatus(
    status: orderStatusEnum,
    project?: ProjectionType<IOrder>,
    options?: QueryOptions<IOrder>
  ): Promise<IOrder[]> {
    return await this._orderModel.find({ status }, project, options);
  }
}
