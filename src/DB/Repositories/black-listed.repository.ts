import { Model } from "mongoose";
import { IBlackListedToken } from "../../Common/Interfaces";
import { BaseRepository } from "./base.repository";
import { BlackListedModel } from "../Models";

export class BlackListedRepository extends BaseRepository<IBlackListedToken> {
  constructor(protected _blackListedTokenModel: Model<IBlackListedToken>) {
    super(BlackListedModel);
  }
}
