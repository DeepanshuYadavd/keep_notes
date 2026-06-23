import { Auth } from "../models/auth.schema.js";
import bcrypt from "bcrypt";

export const signup = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
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
