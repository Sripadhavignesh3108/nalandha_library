import express from "express";
import {
  LoginController,
  RegistrationController,
} from "../controllers/UserController.js";
export let userRouter = express.Router();
userRouter.post("/signup", RegistrationController);
userRouter.post("/login", LoginController);
