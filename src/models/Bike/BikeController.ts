import { Request, Response } from "express";

import { findById, findAll } from "./BikeServices";

export const findBikeById = async (req: Request, res: Response) => {
  try {
    const bike = await findById(req.params.bike_id);
    res.send(bike);
  } catch (err) {
    res.send(err);
  }
};
export const findAllBikes = async (req: Request, res: Response) => {
  try {
    const bikes = await findAll();
    res.send(bikes);
  } catch (err) {
    res.send(err);
  }
};
