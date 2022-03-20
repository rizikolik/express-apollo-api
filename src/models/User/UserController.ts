import { Console } from "console";
import { NextFunction, Request, Response } from "express";

import { LoginUser, SignUpNewUser } from "./UserServices";

export const Login = async (req: Request, res: Response) => {
  try {
    const response = await LoginUser(req.user);
    res.send(response);
  } catch (err) {
    res.send(err);
  }
};

export const Signup = async (req: Request, res: Response) => {
  try {
    const response = await SignUpNewUser(req);
    res.send(response);
  } catch (err) {
    res.send(err as Error);
  }
};

module.exports = {
  Login,
  Signup,
};
