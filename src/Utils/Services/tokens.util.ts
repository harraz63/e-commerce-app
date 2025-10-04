import jwt, { SignOptions } from "jsonwebtoken";
import { ITokenPayload } from "../../Common/Interfaces";

// Generate Token
export const generateToken = (
  payload: ITokenPayload | Buffer | object,
  secret: string,
  options: SignOptions
): string => {
  const token = jwt.sign(payload, secret, options);
  return token;
};

// Verify Token
export const verifyToken = (token: string, secret: string): ITokenPayload => {
  if (!token) throw new Error("Token is required");

  const decoded = jwt.verify(token, secret) as ITokenPayload;
  return decoded;
};
