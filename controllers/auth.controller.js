import { User } from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import { OTPCode } from "../utils/OTPCode.js";
import { ExpiresOTP } from "../utils/ExpiresOTP.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";


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
    const verifcationCode = OTPCode();
    const verifcationCodeExpires = ExpiresOTP();
    const user = await User.create({
      email,
      password: hashPassword,
      verificationToken: verifcationCode,
      verificationTokenExpires: verifcationCodeExpires,
    })

    await user.save();

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
  console.log("hello login");
  res.json({ message: "hello login" });
};

export const logout = async (req, res) => {
  console.log("hello logout");
  res.json({ message: "hello logout" });
};
