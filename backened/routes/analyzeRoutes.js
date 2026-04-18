import express from "express";
import { analyzeController } from "../controllers/analyzeController.js";
import { getBankDetails } from "../controllers/detailsController";

const Analyzerouter = express.Router();

Analyzerouter.post("/", analyzeController);
Analyzerouter.post("/details",getBankDetails)

export default Analyzerouter;