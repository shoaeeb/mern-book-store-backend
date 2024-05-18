import express from "express";
import userController from "../controllers/userController";
import { jwtCheck, jwtParse } from "../middlewares/auth";

const router = express.Router();

router.post("/", jwtCheck, userController.createUser);
router.get("/", jwtCheck, jwtParse, userController.myProfile);
router.post("/update", jwtCheck, jwtParse, userController.updateMyProfile);

export default router;
