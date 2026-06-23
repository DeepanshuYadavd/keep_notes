import mongoose from "mongoose";

export const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to db");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};
