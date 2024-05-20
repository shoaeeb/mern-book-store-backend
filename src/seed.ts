import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import Books from "./models/bookModel";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("DataBase Connected");
});

function generationRandomHexValues() {
  return crypto.randomBytes(12).toString("hex");
}

const bookData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "bookData.json")).toString()
);
let data = bookData.map((book: any) => {
  return {
    _id: new mongoose.Types.ObjectId(generationRandomHexValues()),
    user: new mongoose.Types.ObjectId("66477c50f48b7f02208321e8"),
    ...book,
  };
});

const seed = async () => {
  try {
    await Books.insertMany(data);
    console.log("Database seeded");
  } catch (error) {
    console.log(error);
  }
};

seed();
