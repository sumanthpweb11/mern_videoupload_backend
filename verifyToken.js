import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  // take access token from cookie
  const token = req.cookies.access_token;

  if (!token) return next(createError("401", "You are not authenticted"));

  // now verify token from user to check if valid user
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError("403", "Invalid Token"));

    // from user id will be taken to verify user in routes
    req.user = user;
    next();
  });
};
