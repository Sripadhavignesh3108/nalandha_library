import express from "express";
import {
  AdminRegistrationController,
  LoginController,
  RegistrationController,
} from "../controllers/UserController.js";

export let userRouter = express.Router();
userRouter.post("/signup", RegistrationController);
userRouter.post("/signup/asAnAdmin", AdminRegistrationController);
userRouter.post("/login", LoginController);
