import express from "express";
import { analyzeController } from "../controllers/analyzeController.js";
import { getBankDetails } from "../controllers/detailsController.js";
import userAuth from "../middlewear/userAuth.js";

const Analyzerouter = express.Router();

Analyzerouter.post("/",userAuth, analyzeController);
Analyzerouter.post("/details",getBankDetails)

export default Analyzerouter;