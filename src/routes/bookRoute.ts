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

router.get(
  "/single/:bookId",
  jwtCheck,
  jwtParse,
  bookController.getSingleBookById
);

router.put(
  "/:bookId",
  upload.single("coverImage"),
  jwtCheck,
  jwtParse,
  validateAddBookRequest,
  bookController.updateBook
);
router.post(
  "/",
  upload.single("coverImage"),
  jwtCheck,
  jwtParse,
  validateAddBookRequest,
  bookController.addBook
);
router.get("/", jwtCheck, jwtParse, bookController.myAddedBooks);

export default router;
