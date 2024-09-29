import mongoose from "mongoose";

const borrowScema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: [true, "Book is required"],
  },
  borrowDate: {
    type: Date,
    default: Date.now,
  },
  isReturn: {
    type: Boolean,
    default: false,
  },
});

export const borrowModel = mongoose.model("Borrow", borrowScema);
