import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";

import { verifyToken } from "../Utils";
import { IRequest, IUser } from "../Common/Interfaces";
import { BlackListedModel, UserModel } from "../DB/Models";
import { BlackListedRepository, UserRepository } from "../DB/Repositories";

const userRepo = new UserRepository(UserModel);
const blackListedRepo = new BlackListedRepository(BlackListedModel);

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization: accessToken } = req.headers;
  if (!accessToken) {
    return res
      .status(401)
      .json({ success: false, message: "Please Login First" });
  }

  const decodedData = verifyToken(
    accessToken,
    process.env.JWT_ACCESS_SECRET as string
  );
  if (!decodedData._id) {
    return res.status(401).json({ success: false, message: "Invalid Payload" });
  }

  const blackListedToken = await blackListedRepo.findOneDocument({
    tokenId: decodedData.jti,
  });
  if (blackListedToken) {
    return res.status(401).json({
      success: false,
      message: "Your Session Is Expired Please Login Again",
    });
  }

  const user: IUser | null = await userRepo.findDocumentById(
    decodedData._id,
    "-password"
  );
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "Please Loign First" });
  }

  (req as unknown as IRequest).loggedInUser = {
    user,
    token: decodedData as JwtPayload,
    tokenId: (decodedData as JwtPayload).jti!,
    expirationDate: (decodedData as JwtPayload).exp
      ? new Date((decodedData as JwtPayload).exp! * 1000)
      : null,
  };
  next();
};
