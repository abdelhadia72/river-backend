import express from 'express';
import { addCoins, dailyReward } from '../controllers/coins.controller.js';
const router = express.Router();

router.post("/add", addCoins);
router.post("/daily-reward", dailyReward);

export default router;
