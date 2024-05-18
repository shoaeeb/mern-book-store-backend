import { Request, Response } from "express";
import User from "../models/userModel";

const createUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id, email } = req.body;
    const user = await User.findOne({ auth0Id, email });
    if (user) {
      res.status(200).send();
      return;
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const myProfile = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth0Id;
    const userId = req.userId;
    const user = await User.findOne({ _id: userId, auth0Id }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateMyProfile = async (req: Request, res: Response) => {
  const auth0Id = req.auth0Id;
  const userId = req.userId;
  try {
    const user = await User.findOne({ _id: userId, auth0Id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.city = req.body.city;
    user.country = req.body.country;
    user.name = req.body.name;
    user.addressLine1 = req.body.addressLine1;
    user.updatedAt = new Date();
    await user.save();
    res.json({ message: "User Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default {
  createUser,
  myProfile,
  updateMyProfile,
};
