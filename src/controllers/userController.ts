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

export default {
  createUser,
};
