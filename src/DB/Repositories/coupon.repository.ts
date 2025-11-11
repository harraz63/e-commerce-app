import { BaseRepository } from "./base.repository";
import { ICoupon } from "../../Common";
import { Model } from "mongoose";

export class CouponRepository extends BaseRepository<ICoupon> {
  constructor(protected _couponModel: Model<ICoupon>) {
    super(_couponModel);
  }

  //Find Coupon By Id
  async findCouponById(id: string): Promise<ICoupon | null> {
    return await this._couponModel.findById(id);
  }

  //Find Coupon By Code
  async findCouponByCode(code: string): Promise<ICoupon | null> {
    return await this._couponModel.findOne({ code });
  }

  // Create Coupon
  async createCoupon(coupon: ICoupon): Promise<ICoupon> {
    return await this._couponModel.create(coupon);
  }

}
