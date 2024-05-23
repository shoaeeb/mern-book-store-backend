import mongoose, { mongo } from "mongoose";

export type BookType = {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  genre: string[];
  publicationYear: string;
  price: number;
};

interface IBooks {
  user: mongoose.Types.ObjectId;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  genre: string[];
  publicationYear: string;
  price: number;
}

interface IBooksDocument extends IBooks {
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new mongoose.Schema<IBooksDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    author: { type: String, required: [true, "Author is required"] },
    description: { type: String, required: [true, "Description is required"] },
    title: { type: String, required: [true, "Title is required"] },
    genre: [{ type: String, required: [true, "Genre is required"] }],
    coverImage: { type: String, required: [true, "CoverImage is required"] },
    publicationYear: {
      type: String,
      required: [true, "publication year is required"],
    },
    price: { type: Number, required: [true, "This field is required"] },
  },
  { timestamps: true }
);

const Books = mongoose.model("Book", bookSchema);

export default Books;
