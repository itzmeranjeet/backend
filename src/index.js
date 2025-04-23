import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./env",
});
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error before app listening", error);
      throw error;
    });
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running is port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    "Mongo DB connection error", err;
  });

/*
import express from "express";
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
const app = express()(async () => {
  try {
    await mongoose.connect(`process.env.${MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log(error);
    });

    app.listen(process.env.PORT, () => {
      console, log(`App is running port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("ERROR : ", error);
  }
})();

*/
