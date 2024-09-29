import { userModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bycrpt from "bcrypt";

export const RegistrationController = async (req, res) => {
  try {
    //Checking for user
    const userCheck = await userModel.findOne({ email: req.body.email });
    const usernameCheck = await userModel.findOne({
      username: req.body.username,
    });
    //if user already exist
    if (userCheck) {
      return res.status(400).json({
        message: "user already exists with provided Email Address",
        status: "failed",
      });
    }
    //if username already exist
    if (usernameCheck) {
      return res.status(400).json({
        message: "username already exists ",
        status: "failed",
      });
    }
    const hashedPassword = await bycrpt.hash(req.body.password, 12);
    //else creating new user account in Database
    await userModel.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // sending Response
    return res.status(201).json({
      message: "registered successfully",
      status: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error, please try again later",
      status: "failed",
    });
  }
};

export const LoginController = async (req, res) => {
  try {
    //checking for user
    const { email, password } = req.body;
    const userCheck = await userModel.findOne({ email: email });
    if (!userCheck) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordMatch = bycrpt.compareSync(password, userCheck.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    // creating a JWT token for future purpose
    const token = jwt.sign(
      {
        id: userCheck._id,
        username: userCheck.username,
        email: userCheck.email,
        role: userCheck.role,
      },
      "secret@3108key",
      {
        expiresIn: "100d",
      }
    );
    // sending success response to user
    return res.status(200).json({
      message: "logged in successfully",
      status: "success",
      token,
      user: {
        id: userCheck._id,
        username: userCheck.name,
        email: userCheck.email,
        role: userCheck.role,
      },
    });
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error, please try again later",
      status: "failed",
      error,
    });
  }
};
