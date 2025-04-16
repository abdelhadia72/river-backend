import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.post("/logout", (req, res) => {
    console.log("User logout");
});

router.get("/me", (req, res) => {
    console.log("hello");
});

export default router;
