import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request } from "express";
import { UserType } from "generalTypes";
dotenv.config();

const secret = process.env.jwtSecret as string;
export const tokenForUser = (user?: UserType) => {
  if (!user) return null;
  const timestamp = new Date().getTime();

  return jwt.sign({ user: user._id, iat: timestamp }, secret);
};
export const getTokenFromRequest = (request: Request) => {
  const header = request.headers.authorization;

  if (header) {
    const token = header.split(" ")[1];
    return token;
  }
  return null;
};
export const verifyToken = (token: string) => {
  // valid token returns a decoded object
  try {
    const verifiedPayload = jwt.verify(token, secret);
    //Here time check will be added for token refresh process
    return verifiedPayload;
  } catch (error) {
    return null;
  }
};
