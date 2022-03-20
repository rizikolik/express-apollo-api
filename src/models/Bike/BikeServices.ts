import axios from "axios";
import mongoose from "mongoose";

const FETCH_URL = process.env.FETCH_URL;
export const findById = (id: string) => {
  const model = mongoose.model("Bike");
  return model.findById(id);
};
export const findAll = async () => {
  const Bike = mongoose.model("Bike");

  let bikes = await Bike.find();
  if (bikes.length <= 2 && FETCH_URL) {
    const res = await axios.get(FETCH_URL);
    Bike.insertMany(res.data.data.bikes);
    return res.data.data.bikes;
  }
  return bikes;
};

module.exports = {
  findById,
  findAll,
};
