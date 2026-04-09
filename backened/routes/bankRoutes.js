import express from "express";

import userAuth from "../middlewear/userAuth.js";
import { BankData } from "../controllers/BankController.js";
const BankRouter = express.Router();

BankRouter.get('/',BankData)
export default BankRouter;