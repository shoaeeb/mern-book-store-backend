import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: errors.array().map((error: any) => error.msg + " "),
    });
    return;
  }
  next();
};

export const validateAddBookRequest = [
  body("title").isString().notEmpty().withMessage("title is required"),
  body("author").isString().notEmpty().withMessage("author is required"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("desription is required"),
  body("publicationYear")
    .isString()
    .notEmpty()
    .withMessage("publication year is required"),
  body("price").isNumeric().withMessage("Price is required"),
  body("genre")
    .isArray()
    .withMessage("genre must be an array")
    .not()
    .isEmpty()
    .withMessage("Atleast one genre is required"),
  handleValidationErrors,
];
