import mongoose, { trusted } from "mongoose";

interface IUser {
  auth0Id: string;
  email: string;
  name: string;
  city: string;
  country: string;
  addressLine1: string;
}

export interface IUserDocument extends IUser {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDocument>({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, default: "" },
  city: { type: String, default: "" },
  country: { type: String, default: "" },
  addressLine1: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
