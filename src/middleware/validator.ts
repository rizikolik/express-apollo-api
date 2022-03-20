import { NextFunction, Request, Response } from "express";

export const SignupBodyValidator = (
  req: Request,
  res: Response,
  next: (req: Request, res: Response) => void
) => {
  if (!req.body) {
    return res.status(400).send("Body cant be emtpy!");
  }

  const { email, password, firstName, lastName } = req.body;

  // Check if any of the required areas is Empty or null

  // Create Custom error messages with the help of precreated err(or helpers
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).send("Please fill all the areas of form");
  }
  // If validation successfully completed go to the next middleware
  return next(req, res);
};
