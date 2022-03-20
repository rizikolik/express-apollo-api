import express, { Request, Response } from "express";
const router = express.Router();
import * as path from "path";

import "../../utils/passport";
import { requireLogin } from "../../middleware/requireLogin";

import passport from "passport";

import { SignupBodyValidator } from "../../middleware/validator";
import { Login, Signup } from "./UserController";
import { NextFunction } from "express-serve-static-core";
router
  .route("/hello")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    await requireLogin(req, res, () =>
      res.send({ mesage: "sdsadasdsadsadasd" })
    );
  });
router
  .route("/login")
  .post(passport.authenticate("local", { session: false }, Login));

router.route("/signup").post((req: Request, res: Response) => {
  SignupBodyValidator(req, res, Signup);
});

module.exports = router;
