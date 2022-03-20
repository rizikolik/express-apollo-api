import mongoose from "mongoose";
const { Schema } = mongoose;

// Define our model
const bikeSchema = new Schema({
  bike_id: String,
  lat: Number,
  lon: Number,
  is_reserved: Number,
  is_disabled: Number,
  vehicle_type: String,
  android: String,
  ios: String,
});

// Create the user model
export const BikeModel = mongoose.model("Bike", bikeSchema);
