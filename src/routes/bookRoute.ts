import express from "express";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import { validateAddBookRequest } from "../middlewares/validation";
import bookController from "../controllers/bookController";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //5mb
  },
});

router.post(
  "/",
  upload.single("coverImage"),
  jwtCheck,
  jwtParse,
  validateAddBookRequest,
  bookController.addBook
);

export default router;
