import express from 'express';
import { forgetPassword, login, logout, register, resetOTPToken, resetPassword, verifyEmail } from '../controllers/auth.controller.js';
const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.post("/verify-email", verifyEmail);

router.post("reset-otp", resetOTPToken);

router.post("/logout", logout);

router.post("/forget-password", forgetPassword);

router.post("/reset-password", resetPassword)

router.get("/me", (req, res) => {
    console.log("hello");
});

export default router;
