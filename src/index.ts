import "dotenv/config";
import mongoose from "mongoose";
import express, { Request, Response } from "express";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import userRouter from "./routes/userRoute";
import bookRouter from "./routes/bookRoute";

const PORT = process.env.PORT || 7000;

//connect to database;
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("Connected to database");
});

//connect to cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.API_KEY as string,
  api_secret: process.env.API_SECRET as string,
});

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/books", bookRouter);

app.get("/health", (req: Request, res: Response) => {
  res.json({ message: "health ok" });
});

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});
