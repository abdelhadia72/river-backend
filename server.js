import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv';
import morgan from 'morgan';

import authRoutes from './route/auth.route.js';
import coinsRoutes from './route/coins.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('/api/test-auth', (req, res) => {
  const authHeader = req.headers.authorization;

  return res.json({
    hasAuthHeader: !!authHeader,
    authHeader: authHeader,
    cookies: req.cookies,
    body: req.body
  });
});

app.use("/api/auth", authRoutes)
app.use("/api/coins", coinsRoutes)

connectDB()
  .then(() => {
    app.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  })
  .catch(err => {
    console.error("Failed to connect to database:", err);
  });
