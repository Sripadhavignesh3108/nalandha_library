import mongoose from "mongoose";
import express from "express";
import { userRouter } from "./routes/userRoute.js";
import { BooksRouter } from "./routes/booksRoute.js";
import cors from "cors";
import { BorrowRouter } from "./routes/borrowRoute.js";
const PORT = process.env.PORT || 4000;
let app = express();
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/books", BooksRouter);
app.use("/api/borrowBook", BorrowRouter);
// connecting server to Database
mongoose
  .connect(
    "mongodb+srv://sripadhavigneshdev:z8ZOFOzAZfzfcOHx@clusterfornalandha.segrq.mongodb.net/?retryWrites=true&w=majority&appName=ClusterForNalandha"
  )
  .then(() => console.log("Data base is connected"))
  .catch((e) => console.log(e));

// Running server
app.listen(PORT, () => {
  console.log("server is successfully running");
});
