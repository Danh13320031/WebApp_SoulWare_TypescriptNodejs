import mongoose from "mongoose";
import { DATABASE_URL } from "../constants/constant";

const connectDbConfig = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB::: ", error);
  }
};

export default connectDbConfig;
