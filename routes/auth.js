import express, { Router } from "express";
import { google, signin, signup } from "../controllers/authctrl.js";

const router = express.Router();

// CREATE USER /REGISTER
router.post("/signup", signup);

// SIGN IN
router.post("/signin", signin);

// GOOGLE AUTHENTICATION
router.post("/google", google);

export default router;
