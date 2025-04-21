import express from 'express';
import { check, forgetPassword, login, logout, me, register, resetOTPToken, resetPassword, verifyEmail } from '../controllers/auth.controller.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.post("/verify-email", verifyEmail);

router.post("/reset-otp", resetOTPToken);

router.post("/logout", logout);

router.post("/forget-password", forgetPassword);

router.post("/reset-password", resetPassword)

router.get('/me', protect, me);
router.get('/check', protect, check);

export default router;
