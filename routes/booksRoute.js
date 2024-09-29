import express from "express";
import {
  AddNewBooks,
  BooksList,
  deleteBook,
  UpdateBooks,
} from "../controllers/BooksController.js";
import { restrict, verify } from "../middlewares/authMiddleware.js";
import mongoose from "mongoose";
import { bookModel } from "../models/bookModel.js";
export const BooksRouter = express.Router();

BooksRouter.post("/addNewBook", verify, restrict("admin"), AddNewBooks);
BooksRouter.post("/updateBook/:id", verify, restrict("admin"), UpdateBooks);
BooksRouter.delete("/deleteBook/:id", verify, restrict("admin"), deleteBook);
BooksRouter.get("/BookList", BooksList);
