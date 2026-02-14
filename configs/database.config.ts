import mongoose from "mongoose";
import { DATABASE_URL } from "../constants/database.constant";

const connectDbConfig = async (): Promise<void> => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB::: ", error);
  }
};

export default connectDbConfig;
