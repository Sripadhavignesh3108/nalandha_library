import express from "express";
import {
  booksAvailability,
  BorrowBook,
  borrowHistory,
  mostAcitveUsers,
  mostBorrowedBooks,
  ReturnBook,
} from "../controllers/BorrowController.js";
import { borrowModel } from "../models/borrowModel.js";
import { bookModel } from "../models/bookModel.js";
import { restrict, verify } from "../middlewares/authMiddleware.js";

export const BorrowRouter = express.Router();
BorrowRouter.post("/borrowBooks", BorrowBook);
BorrowRouter.patch("/returnBook/:id", ReturnBook);
BorrowRouter.get("/history", borrowHistory);

// reports using aggregations;
BorrowRouter.get(
  "/mostBorrowedBooks",
  verify,
  restrict("admin"),
  mostBorrowedBooks
);

BorrowRouter.get(
  "/mostActiveUsers",
  verify,
  restrict("admin"),
  mostAcitveUsers
);

BorrowRouter.get(
  "/booksAvailability",
  verify,
  restrict("admin"),
  booksAvailability
);
