import { Request } from "express";
import { UserType } from "generalTypes";

import mongoose from "mongoose";
import { tokenForUser } from "../../utils/tokenUtils.js";

export const LoginUser = async (user?: UserType) => {
  const token = tokenForUser(user);
  const response = Object.assign({ token: token }, user?._doc);
  return token ? response : Error("Token is not created..");
};

export const SignUpNewUser = async (req: Request) => {
  const User = mongoose.model("User");
  const { email, password, firstName, lastName } = req.body;
  // Checking email is in use made by schema validation ,so no need here.
  if (!email || !password || !firstName || !lastName)
    return Error("Body cant be Empty!");

  const user = {
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
  };
  const moduleInstance = new User(user);
  await moduleInstance.save();

  const token = tokenForUser(moduleInstance as unknown as UserType);
  // Respond to request indicating the user was created
  return { ...user, token };
};
export const findUserByEmail = (email: string) => {
  const User = mongoose.model("User");
  return User.findOne({ email }).exec();
};
