import { bookModel } from "../models/bookModel.js";
import mongoose from "mongoose";

export const AddNewBooks = async (req, res) => {
  try {
    const { title, author, ISBN, releaseDate, genre, copies } = req.body;
    if (!title || !author || !ISBN || !genre || !copies) {
      return res.status(400).json({
        message: "Some Required-data is missing please mention them",
      });
    }
    const existBook = await bookModel.findOne(
      { title: title } || { ISBN: ISBN }
    );
    if (existBook) {
      return res.status(400).json({
        message: "Book is already exist",
        status: "bad Request",
      });
    }
    const Bookcreation = await bookModel.create({
      title,
      author,
      ISBN,
      releaseDate,
      genre,
      copies,
    });
    res.status(201).json({
      message: "New book is successfully added to Library",
      status: "success",
      data: Bookcreation,
    });
  } catch {
    res.status(500).json({
      message: "server is not responding",
    });
  }
};

export const UpdateBooks = async (req, res) => {
  const { title, author, ISBN, releaseDate, genre, copies } = req.body;

  // Validate required fields
  if (!title || !author || !ISBN || !genre || !copies) {
    return res.status(400).json({
      message: "Some Required-data is missing, please mention them",
    });
  }

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  try {
    // Perform the update
    const updateBook = await bookModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Returns the updated document
        runValidators: true, // Runs schema validators
      }
    );

    // Check if the book was found and updated
    if (!updateBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Send the updated document as a response
    res.status(200).json(updateBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({
      message: "Error updating book",
      issue: error.errorResponse,
    });
  }
};

export const deleteBook = async (req, res) => {
  console.log(req.params.id);
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        message: "Invalid book ID (or) Book with This ID does not exist",
      });
    }
    let isDelete = await bookModel.findByIdAndDelete(req.params.id, {
      projection: { title: 1 },
    });
    if (isDelete !== null) {
      return res.status(410).json({
        message: "Book is successfully Removed from Library",
      });
    } else {
      return res.status(404).json({
        message: "book ID is not found",
      });
    }
  } catch (error) {
    return res.send({
      message: error,
      somethingWentWrong: "something Went Wrong",
    });
  }
};

export const BooksList = (req, res) => {
  bookModel
    .find()
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json({
          message: "Books List",
          data: data,
        });
      } else {
        res.status(404).json({ message: "No Books are Found" });
      }
    })
    .catch((err) =>
      res.status(500).json({
        message: "Something went wrong please try again",
        error: err,
      })
    );
};

