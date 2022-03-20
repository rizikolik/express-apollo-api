import { NextFunction } from "express";

import mongoose from "mongoose";
const { Schema } = mongoose;
import bcrypt from "bcrypt";

// Define our model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    index: true,
    lowercase: true,
  },
  password: String,
  firstName: String,
  lastName: String,
});

// On Save Hook, encrypt password
//@ts-ignore
userSchema.pre("save", async function (this: any, next: NextFunction) {
  // get access to the user model
  var user = this;
  const hashedPassword = await bcrypt.hashSync(user.password, 12);
  user.password = hashedPassword;
  next();
});
userSchema.methods.validatePassword = (
  password: string,
  hashedPassword: string,
  callback: NextFunction
) => {
  bcrypt.compare(password, hashedPassword, (err?: Error, isMatch?: boolean) => {
    if (err) return callback(err);
    callback(isMatch);
  });
};
userSchema.methods.comparePassword = function (
  candidatePassword: string,
  callback: (err?: Error | null, user?: any, info?: any) => void
) {
  bcrypt.compare(
    candidatePassword,
    this.password,
    (err?: Error, isMatch?: boolean) => {
      callback(err, isMatch);
    }
  );
};

// Create the user model
export const UserModel = mongoose.model("User", userSchema);
