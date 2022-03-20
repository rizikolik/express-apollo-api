import { UserType } from "generalTypes";

declare module "express-serve-static-core" {
  export interface Request {
    headers: {
      authorization?: any;
    };
    user?: UserType;
  }
}
