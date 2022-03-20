import { Request, Response } from "express";

import express from "express";
const router = express.Router();

import { findBikeById, findAllBikes } from "./BikeController";

router.route("/bikes").get((req: Request, res: Response) => {
  return findAllBikes(req, res);
});

router.route("/bikes/:bike_id").get((req: Request, res: Response) => {
  return findBikeById(req, res);
});

module.exports = router;
