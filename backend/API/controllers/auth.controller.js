import { Auth } from "../models/auth.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    console.log(req.body, "test");
    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }
    //  user check:

    const isUser = await Auth.findOne({ email });
    if (isUser) {
      return res.status(400).json({
        message: "Email is already exist",
      });
    }

    //  hashed password before create data :
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Auth.create({
      userName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "user Register Successfully",
      data: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    //  password match:
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({
        message: "Password is incorrect",
      });
    }
    //  token generation:
    const token = await jwt.sign(
      {
        id: user._id,
        userName: user.userName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 1000,
      })
      .json({
        message: "Login Successfully",
        data: {
          _id: user._id,
          userName: user.userName,
          email: user.email,
        },
      });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const logout = async (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .json({
        message: "Logout Successfully",
      });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await Auth.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

