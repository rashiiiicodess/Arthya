import express from "express";
import { analyzeController } from "../controllers/analyzeController.js";

const Analyzerouter = express.Router();

Analyzerouter.post("/", analyzeController);

export default Analyzerouter;