import express, { urlencoded } from "express";
import dotenv from "dotenv";
import authRouter from "./API/routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

//  config:
dotenv.config();
//  middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(
  urlencoded({
    extended: true,
  }),
);

//  routes

app.use("/api/auth", authRouter);

// http://localhost:3000/api/auth/signup

export default app;
