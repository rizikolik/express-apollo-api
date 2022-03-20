import { NextFunction, Request, Response } from "express";

import { getTokenFromRequest, verifyToken } from "../utils/tokenUtils";

export const requireLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isLoggedIn(req)) {
    res.statusCode = 404;

    return res.send({
      message:
        "Check Your Token or Go to Login or Signup for Getting a Valid Token",
    });
  }
  next();
};

function isLoggedIn(req: Request) {
  return validJWTToken(req);
}

function validJWTToken(req: Request) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return false;
  }
  const decoded = verifyToken(token);

  return decoded;
}
