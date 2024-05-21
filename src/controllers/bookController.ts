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

const myAddedBooks = async (req: Request, res: Response) => {
  try {
    const pageSize = 5;
    const page = req.query.page ? Number(req.query.page) : 1;
    const skip = (page - 1) * pageSize;

    const books = await Books.find({ user: req.userId }).skip(skip).limit(5);
    const total = await Books.countDocuments({ user: req.userId });
    const response = {
      data: books,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getSingleBookById = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const book = await Books.findOne({ _id: bookId, user: req.userId });
    if (!book) {
      res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const book = await Books.findOne({
      _id: bookId,
      user: req.userId,
    });
    if (!book) {
      return res.status(404).json({ message: "Book Not Found" });
    }

    console.log(req.file);
    if (req.file) {
      const uploadedUrl = await uploadResponse(req.file as Express.Multer.File);
      req.body.coverImage = uploadedUrl;
    }

    book.title = req.body.title;
    book.author = req.body.author;
    book.description = req.body.description;
    book.price = req.body.price;
    book.genre = req.body.genre;
    book.publicationYear = req.body.publicationYear;
    book.coverImage = req.body.coverImage || book.coverImage;
    await book.save();
    res.json(book);
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

const searchBook = async (req: Request, res: Response) => {
  try {
    const pageSize = 10;
    const page = req.query.page ? Number(req.query.page) : 1;
    const skip = (page - 1) * pageSize;
    let query: any = {};
    const selectedGenre = (req.query.selectedGenre as string) || "";
    if (req.query.query) {
      query.$or = [
        { title: { $regex: req.query.query, $options: "i" } },
        { author: { $regex: req.query.query, $options: "i" } },
      ];
    }
    if (selectedGenre) {
      const selectedGenreArr = selectedGenre
        .split(",")
        .map((genre) => new RegExp(genre, "i"));
      query["genre"] = { $all: selectedGenreArr };
    }

    let sort: any = {};
    if (req.query.sort) {
      sort["price"] = req.query.sort === "asc" ? 1 : -1;
    } else {
      sort["updatedAt"] = -1;
    }

    let count = await Books.countDocuments(query);
    if (count === 0) {
      delete query["$or"];
    }

    let book: any = [];
    let total = 0;
    book = await Books.find(query).skip(skip).limit(pageSize).sort(sort);
    total = await Books.countDocuments(query);

    const response = {
      data: book,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getSingleBookForSearch = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const book = await Books.findOne({
      _id: bookId,
    });
    if (!book) {
      return res.status(404).json({ message: "Not Found" });
    }
    res.json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default {
  addBook,
  myAddedBooks,
  getSingleBookById,
  updateBook,
  searchBook,
  getSingleBookForSearch,
};
