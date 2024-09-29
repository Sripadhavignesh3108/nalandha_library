import { bookModel } from "../models/bookModel.js";
import { borrowModel } from "../models/borrowModel.js";
import { userModel } from "../models/userModel.js";

export const BorrowBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    // validating if the user provided correct details or not.
    if (!userId && !bookId) {
      return res
        .status(400)
        .json({ message: "userId  and bookId is a required field" });
    }

    let userData = await userModel.findOne({ _id: userId });
    let Bookdata = await bookModel.findOne({ _id: bookId });
    const borrowData = await borrowModel.findOne({ userId: userId });

    // checking if bookdata with user provided id is available or not.
    if (Bookdata && userData) {
      const { copies } = Bookdata;
      if (copies > 0) {
        // checking if user has already borrowed the book or not.
        if (
          borrowData &&
          borrowData.userId.toString() == userId &&
          borrowData.bookId.toString() === bookId
        ) {
          return res
            .status(400)
            .json({ message: "You have already borrowed this book" });
        }
        // updating the book copies and adding the borrow data to the borrow collection.
        else {
          const bookIsBorrowed = await borrowModel.create({
            userId,
            bookId,
            borrowDate: Date.now(),
          });
          const updatedBook = await bookModel.updateOne(
            { _id: bookId },
            { $inc: { copies: -1 } }
          );
          return res.status(201).json({
            message: "Book borrowed successfully",
            bookdata: Bookdata,
            borrowDetails: bookIsBorrowed,
          });
        }
      } else {
        return res.status(400).json({ message: "Book is not available" });
      }
    } else {
      if (!userData) {
        return res.status(400).json({ message: "User not found" });
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: "Error creating borrow",
      error: error.message,
    });
  }
};

export const ReturnBook = async (req, res) => {
  try {
    const { id: borrowId } = req.params; // Get borrowId from the URL params

    // Find the borrow record by borrowId
    const borrowRecord = await borrowModel.findById(borrowId);
    // Check if the borrow record exists
    if (!borrowRecord) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    // Check if the book has already been returned
    if (borrowRecord.isReturn) {
      return res
        .status(400)
        .json({ message: "This book has already been returned" });
    }

    // Mark the book as returned
    borrowRecord.isReturn = true;
    await borrowRecord.save();

    // Update the book collection to increase the number of available copies
    await bookModel.updateOne(
      { _id: borrowRecord.bookId },
      { $inc: { copies: 1 } }
    );

    return res.status(200).json({
      message: "Book returned successfully",
      borrowDetails: borrowRecord,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error returning the book",
      posibility: " Invalid borrowId Provided",
      error: error.message,
    });
  }
};

export const borrowHistory = async (req, res) => {
  let booksArray = [];
  try {
    const { userId } = req.body;

    // Validate if userId is provided in the body
    if (!userId) {
      return res.status(400).json({ message: "userId is a required field" });
    }

    // Find all borrow records for the given userId
    const borrowHistory = await borrowModel.find({ userId });

    // Check if the user has borrowed any books
    if (borrowHistory.length === 0) {
      return res
        .status(404)
        .json({ message: "No borrow history found for this user" });
    }
    // creating  a new array of books with of user borrowed;
    for (let i of borrowHistory) {
      let eachbook = await bookModel.findOne({ _id: i.bookId.toString() });
      if (!booksArray.includes(eachbook)) booksArray.push(eachbook);
    }
    // Return borrow history (both returned and not returned)
    return res.status(200).json({
      message: "Borrow history retrieved successfully",
      borrowHistory,
      booksArray,
    });
  } catch (error) {
    // Handle errors
    console.log(error);
    return res.status(500).json({
      message: "Error retrieving borrow history",
      error: error.message,
    });
  }
};
// reports using aggregations

export const mostBorrowedBooks = async (req, res) => {
  try {
    // Perform aggregation to get the most borrowed books
    const mostBorrowedBooks = await borrowModel.aggregate([
      {
        // Group by bookId and count the number of times each book is borrowed
        $group: {
          _id: "$bookId",
          borrowCount: { $sum: 1 },
        },
      },
      {
        // Sort the result by borrowCount in descending order
        $sort: { borrowCount: -1 },
      },
      {
        // Lookup to get book details from the bookModel using bookId
        $lookup: {
          from: "books", // Collection name in MongoDB for books
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        // Unwind the bookDetails array to merge the book data
        $unwind: "$bookDetails",
      },
      {
        // Project only the fields you want to return
        $project: {
          _id: 0,
          bookId: "$_id",
          title: "$bookDetails.title",
          author: "$bookDetails.author",
          ISBN: "$bookDetails.ISBN",
          borrowCount: 1,
        },
      },
    ]);

    // If no borrowed books are found
    if (!mostBorrowedBooks.length) {
      return res.status(404).json({ message: "No borrowed books found" });
    }

    // Return the report in descending order
    return res.status(200).json({
      message: "Most borrowed books retrieved successfully",
      mostBorrowedBooks,
    });
  } catch (error) {
    // Handle any errors that occur during the aggregation
    return res.status(500).json({
      message: "Error retrieving the most borrowed books report",
      error: error.message,
    });
  }
};

export const mostAcitveUsers = async (req, res) => {
  try {
    // Perform aggregation to get the most active users based on borrow count
    const mostActiveUsers = await borrowModel.aggregate([
      {
        // Group by userId and count the number of books each user has borrowed
        $group: {
          _id: "$userId",
          borrowCount: { $sum: 1 },
        },
      },
      {
        // Sort the result by borrowCount in descending order
        $sort: { borrowCount: -1 },
      },
      {
        // Lookup to get user details from the userModel using userId
        $lookup: {
          from: "users", // Collection name in MongoDB for users
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        // Unwind the userDetails array to merge the user data
        $unwind: "$userDetails",
      },
      {
        // Project only the fields you want to return
        $project: {
          _id: 0,
          userId: "$_id",
          username: "$userDetails.username",
          email: "$userDetails.email",
          role: "$userDetails.role",
          borrowCount: 1,
        },
      },
    ]);

    // If no active users are found
    if (!mostActiveUsers.length) {
      return res.status(404).json({ message: "No active users found" });
    }

    // Return the report in descending order of activity
    return res.status(200).json({
      message: "Most active users retrieved successfully",
      mostActiveUsers,
    });
  } catch (error) {
    // Handle any errors that occur during the aggregation
    return res.status(500).json({
      message: "Error retrieving the most active users report",
      error: error.message,
    });
  }
};

export const booksAvailability = async (req, res) => {
  try {
    // Retrieve all books from the bookModel
    const books = await bookModel.find();

    // Check if there are no books available
    if (books.length === 0) {
      return res.status(404).json({ message: "No books found in the library" });
    }

    // Map through the books to create an array of objects with availability status
    const booksAvailability = books.map((book) => ({
      bookId: book._id,
      title: book.title,
      author: book.author,
      ISBN: book.ISBN,
      releaseDate: book.releaseDate,
      genre: book.genre,
      copies: book.copies,
      available: book.copies > 0, // true if copies > 0, false otherwise
    }));

    // Return the books availability data
    return res.status(200).json({
      message: "Books availability retrieved successfully",
      booksAvailability,
    });
  } catch (error) {
    // Handle any errors that occur during the retrieval
    return res.status(500).json({
      message: "Error retrieving books availability",
      error: error.message,
    });
  }
};