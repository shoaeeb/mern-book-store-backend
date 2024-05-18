import { Request, Response } from "express";
import Books from "../models/bookModel";
import { Multer } from "multer";
import { v2 as cloudinary } from "cloudinary";

const addBook = async (req: Request, res: Response) => {
  try {
    const imageFile = req.file as Express.Multer.File;
    console.log(imageFile);
    const uploadedURL = await uploadResponse(imageFile);
    req.body.coverImage = uploadedURL;
    const book = new Books({ ...req.body, user: req.userId });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const uploadResponse = async (imageFile: Express.Multer.File) => {
  const b64 = Buffer.from(imageFile.buffer).toString("base64");
  const dataURI = `data:${imageFile.mimetype};base64,${b64}`;
  const upload = await cloudinary.uploader.upload(dataURI);
  return upload.url;
};

export default {
  addBook,
};
