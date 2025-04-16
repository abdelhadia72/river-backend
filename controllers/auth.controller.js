import { User } from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import { OTPCode } from "../utils/OTPCode.js";
import { ExpiresOTP } from "../utils/ExpiresOTP.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../utils/emailService.js";

export const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required"
      });
    }

    const user = await User.findOne({
      email,
      verificationToken: verificationCode,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code"
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const register = async (req, res) => {
  const { email, password } = req.body;
  console.log("email", email);
  try{
    if(!email || !password){
      throw new Error("Please provide email and password")
    }

    const userAlreadyExist = await User.findOne({ email });
    if(userAlreadyExist){
      return res.status(400).json({ success:false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationCode = OTPCode();
    const verifcationCodeExpires = ExpiresOTP();
    const user = await User.create({
      email,
      password: hashPassword,
      verificationToken: verificationCode,
      verificationTokenExpires: verifcationCodeExpires,
    })

    await user.save();

    await sendVerificationEmail(email, verificationCode);

    generateTokenAndSetCookie(res, user._id);
    res.status(201).json({
      success: true,
      message: 'User Created Successfully',
      user: {
        ...user._doc,
        password: undefined,
      }
    })

  }catch(err){
    console.error(err.message)
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isVerified) {

      // Allow login but warn about verification
      console.log("User not verified, generating new verification code");
      const verificationCode = OTPCode();
      const verificationCodeExpires = ExpiresOTP();

      user.verificationToken = verificationCode;
      user.verificationTokenExpires = verificationCodeExpires;
      await user.save();

      // Send verification email again
      await sendVerificationEmail(email, verificationCode);
    }

    user.lastLogin = new Date();
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "strict"
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during logout"
    });
  }
};


export const forgetPassword = async (req, res) => { }

export const resetOTPToken = async (req, res) => { }

export const resetPassword = async (req, res) => { }
