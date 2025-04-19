import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  coins: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  lastDailyRewardDate: {
    type: Date,
  },
  dailyLoginStreak: {
    type: Number,
    default: 0,
  },
  referredBy: {
    type: String,
  },
  refferals: {
    type: [String],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date,
  verificationToken: String,
  verificationTokenExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {timestamps: true});


export const User = mongoose.model("User", userSchema);
