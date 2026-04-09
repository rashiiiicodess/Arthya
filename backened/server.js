import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import dns from "node:dns";
import authRouter from "./Routes/authRoutes.js";
import { dbConnect } from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import BankRouter from "./routes/bankRoutes.js";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app=express();
const port=process.env.PORT||4002;
dbConnect();

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    console.log("--- Request Monitor ---");
    console.log("Path:", req.path);
    console.log("Cookies Found:", req.cookies);
    next();
});
const allowedOrigins=['http://localhost:5173']
app.use(cors({origin:allowedOrigins ,credentials:true}))

app.use('/api/auth', authRouter);
app.use('/api/user',userRouter)
app.use('/api/bank',BankRouter);


app.listen(port,()=>console.log(`Server started on PORT:${port}`))