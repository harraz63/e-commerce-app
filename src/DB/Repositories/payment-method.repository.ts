import { Model, Types } from "mongoose";
import { IPaymentMethod } from "../../Common";
import { BaseRepository } from "./base.repository";

export class PaymentMethodRepository extends BaseRepository<IPaymentMethod> {
  constructor(protected _paymentMethodModel: Model<IPaymentMethod>) {
    super(_paymentMethodModel);
  }

  //Find Payment Method By Id
  async findPaymentMethodById(
    id: Types.ObjectId
  ): Promise<IPaymentMethod | null> {
    return await this._paymentMethodModel.findById(id);
  }

  //Find Payment Method By User
  async findPaymentMethodByUser(
    user: Types.ObjectId
  ): Promise<IPaymentMethod | null> {
    return await this._paymentMethodModel.findOne({ user });
  }

  //   Create Payment Method
  async createPaymentMethod(
    paymentMethod: IPaymentMethod
  ): Promise<IPaymentMethod> {
    return await this._paymentMethodModel.create(paymentMethod);
  }

  //   Update Payment Method
  async updatePaymentMethod(
    id: Types.ObjectId,
    paymentMethod: IPaymentMethod
  ): Promise<IPaymentMethod | null> {
    return await this._paymentMethodModel.findByIdAndUpdate(id, paymentMethod, {
      new: true,
    });
  }

  //   Delete Payment Method
  async deletePaymentMethod(
    id: Types.ObjectId
  ): Promise<IPaymentMethod | null> {
    return await this._paymentMethodModel.findByIdAndDelete(id);
  }
}
