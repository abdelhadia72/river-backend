import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv';
import morgan from 'morgan';

import authRoutes from './route/auth.route.js';

dotenv.config();
const app = express();
app.use(morgan('dev'));
app.use(express.json());


app.use("/api/auth", authRoutes)

connectDB()
  .then(() => {
    app.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  })
  .catch(err => {
    console.error("Failed to connect to database:", err);
  });
