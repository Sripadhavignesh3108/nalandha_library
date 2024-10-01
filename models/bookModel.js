import mongoose from "mongoose";

const bookShcema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  ISBN: {
    type: Number,
    required: true,
    unique: true,
    min: 13,
  },
  CreatedDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  genre: {
    type: Array,
    required: true,
  },
  copies: {
    type: Number,
    required: true,
  },
});

export const bookModel = mongoose.model("books", bookShcema);
