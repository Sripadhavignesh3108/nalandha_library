import { bookModel } from "../models/bookModel.js";
import mongoose from "mongoose";

export const AddNewBooks = async (req, res) => {
  try {
    const { title, author, ISBN, CreatedDate, genre, copies } = req.body;
    if (title && author && ISBN && genre && copies) {
      const existBook = await bookModel.findOne({
        $or: [{ title: title }, { ISBN: ISBN }],
      });
      console.log(existBook);
      if (existBook) {
        if (existBook.title === title && existBook.ISBN === ISBN) {
          return res.status(400).json({
            message: "Book already exist With provided Title & ISBN Number",
          });
        } else if (existBook.ISBN === ISBN) {
          return res
            .status(400)
            .json({ message: "Book already exist With provided ISBN number" });
        } else if (existBook.title === title) {
          return res
            .status(400)
            .json({ message: "Book already exist With provided Title" });
        }
      }
      const Bookcreation = await bookModel.create({
        title,
        author,
        ISBN,
        CreatedDate,
        genre,
        copies,
      });
      res.status(201).json({
        message: "New book is successfully added to Library",
        status: "success",
        data: Bookcreation,
      });
    } else {
      if (!title && !author && !ISBN && !genre && !copies) {
        return res.status(400).json({
          message: "Please fill all the fields",
          status: "bad Request",
        });
      } else if (!title) {
        return res.status(400).json({
          message: "Title is a Required Field, please Provide title",
        });
      } else if (!author) {
        return res.status(400).json({
          message: "author is a Required Field, please Provide author",
        });
      } else if (!ISBN) {
        return res.status(400).json({
          message: "ISBN is a Required Field, please Provide ISBN",
        });
      } else if (!genre) {
        return res.status(400).json({
          message: "genre is a Required Field, please Provide genre",
        });
      } else if (!copies) {
        return res.status(400).json({
          message: "please Provide no.of copies",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "server is not responding",
      error,
    });
  }
};

export const UpdateBooks = async (req, res) => {
  try {
    const { title, author, ISBN, genre, copies } = req.body;

    // Validate required fields
    if (title && author && ISBN && genre && copies) {
      // Validate the ID format
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }
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
        return res
          .status(404)
          .json({ message: "Book not found with Provided details" });
      }

      // Send the updated document as a response
      res.status(200).json(updateBook);
    } else {
      if (!title && !author && !ISBN && !genre && !copies) {
        return res
          .status(400)
          .json({ message: "Please Provide all Required Fields" });
      } else if (!title) {
        return res.status(400).json({
          message: "Title is a Required Field, please Provide title",
        });
      } else if (!author) {
        return res.status(400).json({
          message: "author is a Required Field, please Provide author",
        });
      } else if (!ISBN) {
        return res.status(400).json({
          message: "ISBN is a Required Field, please Provide ISBN",
        });
      } else if (!genre) {
        return res.status(400).json({
          message: "genre is a Required Field, please Provide genre",
        });
      } else if (!copies) {
        return res.status(400).json({
          message: "please Provide no.of copies",
        });
      }
    }
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({
      message: "Error updating book",
      issue: error,
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
    .find({}, { __v: false })
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
