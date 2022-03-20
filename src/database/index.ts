import Mongoose from "mongoose";
// eslint-disable-next-line no-unused-vars
const dotenv = require("dotenv").config();

// Connect to database
export const dbConnect = async () => {
  const url = process.env.MONGO_CONNECTION_STRING as string;
  await Mongoose.connect(url);
  Mongoose.connection.on("error", (err: Error) => {
    if (err) {
      // Sometimes writing the error line can be helpful
      console.log(
        "CANT CONNECT TO THE DATABASE:Mongoose Connect Error at Database Index file:",
        err
      );
      throw err;
    }
  });
};
