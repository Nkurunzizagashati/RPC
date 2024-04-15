import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const DB_URI = process.env.MONGODB_URI;

const createDbConnection = () => {
  mongoose
    .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`Connected to MongoDB`);
    })
    .catch((error) => {
      console.error(`Error connecting to MongoDB: ${error}`);
    });
};

export default createDbConnection;
