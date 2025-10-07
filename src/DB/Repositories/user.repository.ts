import mongoose, { Model } from "mongoose";
import { IUser } from "../../Common";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<IUser> {
  constructor(protected _userModel: Model<IUser>) {
    super(_userModel);
  }

  //   Find User By Email
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await this._userModel.findOne({ email });
  }

  //Find User By Id
  async findUserById(id: mongoose.Types.ObjectId): Promise<IUser | null> {
    return await this._userModel.findById(id);
  }

  //Find User By Phone
  async findUserByPhone(phone: string): Promise<IUser | null> {
    return await this._userModel.findOne({ phone });
  }

}
