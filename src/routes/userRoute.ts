import express from "express";
import userController from "../controllers/userController";
import { jwtCheck } from "../middlewares/auth";

const router = express.Router();

router.post("/", jwtCheck, userController.createUser);

export default router;
