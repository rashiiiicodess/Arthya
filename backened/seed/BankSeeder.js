import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 1. Resolve paths for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Load .env using MONGO_URL
dotenv.config({ path: path.resolve(__dirname, "../.env") }); 
import dns from "node:dns";
import Bank from "../models/bankModel.js"; 
import { seedBanks } from "../data/seedBankData.js"; 
dns.setServers(["1.1.1.1", "8.8.8.8"]);



const seedDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    await Bank.deleteMany({});
    
    console.log("🏗️ Seeding banks one-by-one to trigger Intelligence Middleware...");

    for (const bankData of seedBanks) {
      const bank = new Bank(bankData);
      await bank.save(); // 100% triggers pre-save middleware
      console.log(`✅ Processed: ${bank.name}`);
    }

    console.log("✨ Seeding successful and analyzed!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
seedDB();