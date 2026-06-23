import express from "express";
import dotenv from "dotenv";
const app = express();

//  config:
dotenv.config();

//  middlewares
app.use(express.json());

//  routes

export default app;
