import jwt from 'jsonwebtoken';
import { User } from '../models/auth.model.js';

export const addCoins = async (req, res) => {
  try {
    const token = req.cookies.token || req.cookies.authToken || req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return res.status(404).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const { coins } = req.body;
    if (!coins || isNaN(coins) || coins <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid positive number of coins"
      });
    }

    user.coins = (user.coins || 0) + parseInt(coins);
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Successfully added ${coins} coins to your account`,
      data: {
        userId: user._id,
        username: user.username || user.name,
        currentCoins: user.coins,
        addedCoins: parseInt(coins)
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired, please log in again"
      });
    }
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding coins",
      error: error.message
    });
  }
};

export const dailyReward = async (req, res) => {
  try {
    const token = req.cookies.token || req.cookies.authToken || req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return res.status(404).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const now = new Date();
    const lastRewardDate = user.lastDailyRewardDate || new Date(0);

    const timeDiff = Math.floor((now - lastRewardDate) / (1000 * 60 * 60 * 24));

    if (timeDiff < 1) {
      return res.status(400).json({
        success: false,
        message: "You have already claimed your daily reward today",
        nextRewardTime: new Date(lastRewardDate.getTime() + 24 * 60 * 60 * 1000)
      });
    }

    if (timeDiff > 1 || user.dailyLoginStreak >= 10) {
      user.dailyLoginStreak = 0;
    }

    user.dailyLoginStreak += 1;

    const rewardAmounts = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    const currentReward = rewardAmounts[user.dailyLoginStreak - 1];

    user.coins = (user.coins || 0) + currentReward;

    user.lastDailyRewardDate = now;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Day ${user.dailyLoginStreak} reward claimed successfully!`,
      data: {
        userId: user._id,
        username: user.username || user.name,
        currentStreak: user.dailyLoginStreak,
        rewardAmount: currentReward,
        currentCoins: user.coins,
        nextRewardAmount: user.dailyLoginStreak < 10 ? rewardAmounts[user.dailyLoginStreak] : rewardAmounts[0],
        streakResetDate: new Date(now.getTime() + 48 * 60 * 60 * 1000)
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired, please log in again"
      });
    }
    return res.status(500).json({
      success: false,
      message: "An error occurred while claiming daily reward",
      error: error.message
    });
  }
};
