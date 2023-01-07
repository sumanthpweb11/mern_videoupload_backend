import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

// SIGNUP
export const signup = async (req, res, next) => {
  try {
    // bcryptjs
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).json({
      message: "user has been created",
    });
  } catch (error) {
    next();
  }
};

// SIGNIN
export const signin = async (req, res, next) => {
  try {
    // --FIND USER--

    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError("404", "user not found"));

    // ---COMPARE PASSWORD BCRYPTJS---

    // compare and if incorrect password
    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError("400", "Wrong Password"));

    // if correct jwt ,cookies and signin

    // token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // dont send password (even if its hashed)
    const { password, ...others } = user._doc;

    // token will be sent to user via cookies
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (error) {
    next();
  }
};

// GOOGLE
export const google = async (req, res) => {};
