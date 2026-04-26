import express from "express";
import userAuth from "../middlewear/userAuth.js";
// REMOVED: import Router from "react"; 
import { getUserData } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);

export default userRouter;