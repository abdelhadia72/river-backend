import express from 'express';
import { createPaymentSheet, processPayment } from '../controllers/stripe.controller.js';

const router = express.Router();

router.post("/payment-sheet", createPaymentSheet);
router.post("/process-payment", processPayment);

export default router;
